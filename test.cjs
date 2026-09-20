// Run with: node test.cjs (no dependencies or live Google requests).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const source = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('var BANDS'));
const receiverSource = fs.readFileSync(__dirname + '/factflow-apps-script.gs', 'utf8');
const names = 'appState,el,BANDS,WARMUP,evaluateBandAnswers,buildFinalResult,beginBand,presentNextQuestion,submitAnswer,handleTimeout,getDueRetest,hasPendingResults,sendResults,init,renderResult,clearSavedResults';
function load(search = '?t=IP5/8', saved = new Map()) {
  let now = Date.parse('2026-09-20T03:00:00Z'), nextTimer = 0;
  const timers = new Map(), elements = new Map();
  const element = () => ({value:'',textContent:'',innerHTML:'',style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},setAttribute(){},addEventListener(){},focus(){}});
  const context = {URLSearchParams,AbortController,Promise,console,Date:class extends Date { constructor(...args){super(...(args.length?args:[now]));} static now(){return now;} },
    window:{location:{search},setTimeout(fn,ms){timers.set(++nextTimer,{fn,ms});return nextTimer;},clearTimeout(id){timers.delete(id);},setInterval(){return 0;},clearInterval(){},addEventListener(){},confirm(){return true;}},
    document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelectorAll(){return [];},addEventListener(){}},
    localStorage:{getItem(key){return saved.get(key)||null;},setItem(key,value){saved.set(key,value);}},
    fetch:async()=>{throw Error('Offline');}
  };
  vm.createContext(context);
  vm.runInContext(source.replace('    init();', `globalThis.api = {${names}};`),context);
  context.api.init();
  return Object.assign(context,{saved,timers,advance(ms){now+=ms;},drain(){for(const [id,t] of timers){if(t.ms<1000){timers.delete(id);t.fn();}}}});
}
function answer(i, correct=true, retest=false) {return {phase:'band',bandId:'B',fact:'3 x 4',familyKey:String(i),correct,category:correct?'fluent':'not_secure',timeout:false,retest};}
function session(c) {return {id:'ffc-test-1',studentName:'Test Student',teacherKey:'IP5/8',code:'TEST-10',assessmentName:'Snapshot',attemptKey:'test',startedAt:new Date().toISOString(),startMs:c.Date.now(),phase:'warmup',currentBandIndex:-1,currentBandId:'Warm-up',blockQueue:c.api.WARMUP.slice(),retestQueue:[],retestFamilyState:{},retestCountInBand:0,questionResults:[],bandResults:[],passedBandIds:[],failedBandIds:[],fastTrack:false,currentBlockMode:'standard'};}

async function run() {
  const c = load(), a = c.api;
  a.appState.session = {fastTrack:false,currentBlockMode:'standard'};
  const base = Array.from({length:8},(_,i)=>answer(i,i<5));
  assert.equal(a.evaluateBandAnswers(base.concat([answer(5,true,true),answer(6,true,true)]),false,a.BANDS[1]),'extra');
  assert.equal(a.evaluateBandAnswers(Array.from({length:8},(_,i)=>answer(i,i<7)),false,a.BANDS[1]),'pass');
  assert.equal(a.evaluateBandAnswers(base.slice(0,4),false,a.BANDS[1]),'incomplete');
  a.appState.session={fastTrack:true,currentBlockMode:'gateway'};
  assert.equal(a.evaluateBandAnswers(Array.from({length:6},(_,i)=>answer(i,i<5)).concat(answer(5,true,true)),false,a.BANDS[1]),'extra');
  assert.equal(a.evaluateBandAnswers(Array.from({length:10},(_,i)=>answer(i,i<9)),true,a.BANDS[1]),'pass');
  assert.equal(a.evaluateBandAnswers(Array.from({length:18},(_,i)=>answer(i)),false,a.BANDS[7]),'pass');
  assert.equal(a.evaluateBandAnswers(Array.from({length:17},(_,i)=>answer(i)),false,a.BANDS[7]),'incomplete');
  const s=session(c);
  s.bandResults=a.BANDS.slice(0,6).map(b=>({bandId:b.id,verdict:'pass'}));
  let result=a.buildFinalResult(s);
  assert.equal(result.verifiedBand,'F');
  assert.equal(result.developingBand,'None identified');
  assert.equal(result.bandResults[6].verdict,'not_assessed');
  s.questionResults=[Object.assign(answer(0),{bandId:'G'})];
  result=a.buildFinalResult(s);
  assert.equal(result.bandResults[6].verdict,'incomplete');
  assert.equal(result.bandResults[7].verdict,'not_assessed');
  s.bandResults.push({bandId:'G',verdict:'fail'});
  assert.equal(a.buildFinalResult(s).developingBand,'G');
  for(const route of ['?t=TYPO','?t=','?t=__proto__','?t=%ZZ']) {assert.equal(load(route).activeTeacher,null);assert.ok(load(route).routeError);}
  assert.equal(load('').activeTeacher.key,'IP5/9');
  assert.equal(load('?t=ip5%2F8').activeTeacher.key,'IP5/8');

  // Exercise the real adaptive flow, including the standard-path budget ceiling.
  for(const standard of [false,true]) {
    const sim=load();const api=sim.api;
    api.appState.session=session(sim);
    api.presentNextQuestion();
    let answered=0;
    while(api.appState.session) {
      api.el.answerInput.value=String(api.appState.currentQuestion.answer);
      sim.advance(standard && answered<2 ? 5000 : 1500);
      api.submitAnswer();sim.drain();answered++;
      assert.ok(answered<=60);
    }
    const r=api.appState.latestResult;
    assert.equal(r.verifiedBand,standard?'F':'H');
    assert.equal(r.totalQuestions,standard?54:60);
    assert.equal(r.developingBand,'None identified');
    if(standard)assert.equal(r.bandResults[6].verdict,'not_assessed');
    await Promise.resolve();await Promise.resolve();
  }
  a.appState.session=Object.assign(session(c),{questionResults:Array(59),blockQueue:[{}],retestQueue:[{dueAfter:0,fact:{a:3,b:4}}]});
  assert.equal(a.getDueRetest(),null);

  // Persist failure, restore it after reload, and only accept an exact receipt.
  result=Object.assign(a.buildFinalResult(session(c)),{totalQuestions:8,correct:8,fluent:8,accuracy:100});
  a.appState.results=[result];a.appState.latestResult=result;
  await a.sendResults();
  assert.equal(result.submissionStatus,'pending');
  assert.ok(a.hasPendingResults());
  c.fetch=async(url,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Object.assign(new Error('Timed out'),{name:'AbortError'}))));
  const timedRequest=a.sendResults();
  [...c.timers.values()].find(timer=>timer.ms===20000).fn();
  await timedRequest;
  assert.match(result.submissionError,/timed out/);
  assert.equal(a.appState.sendingId,null);
  assert.equal(a.el.retryResultsBtn.disabled,false);
  const restored=load('?t=IP5/9',c.saved);
  assert.equal(restored.api.appState.latestResult.assessmentId,result.assessmentId);
  let posted;
  restored.fetch=async(url,options)=>{posted=JSON.parse(options.body);assert.equal(url,restored.TEACHERS['IP5/8'].url);return {ok:true,json:async()=>({ok:true,receiver:'factflow-check-v2',assessmentId:result.assessmentId,spreadsheetId:'WRONG'})};};
  await restored.api.sendResults();
  assert.equal(restored.api.appState.latestResult.submissionStatus,'pending');
  assert.equal(posted.teacherKey,'IP5/8');
  for(const response of [{ok:false,error:'Receiver failed'},null,{ok:true,receiver:'factflow-check-v1'}, {ok:true,receiver:'factflow-check-v2',assessmentId:'wrong',spreadsheetId:restored.TEACHERS['IP5/8'].spreadsheetId}]) {
    restored.fetch=async()=>({ok:true,json:async()=>response});await restored.api.sendResults();assert.ok(restored.api.hasPendingResults());
  }
  restored.api.clearSavedResults();assert.equal(restored.api.appState.results.length,1);
  restored.fetch=async()=>({ok:true,json:async()=>({ok:true,receiver:'factflow-check-v2',assessmentId:result.assessmentId,spreadsheetId:restored.TEACHERS['IP5/8'].spreadsheetId})});
  await restored.api.sendResults();
  assert.equal(restored.api.appState.latestResult.submissionStatus,'sent');
  assert.equal(restored.api.hasPendingResults(),false);
  const blockedStorage=load();
  const unsaved=blockedStorage.api.buildFinalResult(session(blockedStorage));
  blockedStorage.api.appState.latestResult=unsaved;blockedStorage.api.appState.results=[unsaved];
  blockedStorage.localStorage.setItem=()=>{throw Error('Storage full');};
  await blockedStorage.api.sendResults();
  assert.equal(unsaved.submissionStatus,'pending');
  assert.match(blockedStorage.api.el.sendStatus.textContent,/Keep this page open/);

  // In-memory Apps Script services exercise the actual shared receiver.
  let locked=false, flushes=0, failFlush=false, failSummary=false;
  const sheets=new Map();
  class Sheet {
    constructor(name){this.name=name;this.rows=[];this.columns=10;} getMaxColumns(){return this.columns;} insertColumnsAfter(at,count){this.columns+=count;}
    getName(){return this.name;} setName(name){sheets.delete(this.name);this.name=name;sheets.set(name,this);return this;}
    hideSheet(){} getLastRow(){return this.rows.length;} getLastColumn(){return Math.max(0,...this.rows.map(r=>r.length));}
    appendRow(row){assert.ok(locked);this.rows.push(row.slice());}
    getDataRange(){return {getValues:()=>this.rows.map(r=>r.slice())};}
    getRange(row,col,n=1,m=1){assert.ok(col+m-1<=this.columns);return {
      getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>this.rows[row+i-1]?.[col+j-1]??'')),
      getValue:()=>this.rows[row-1]?.[col-1]??'',
      setValues:values=>{assert.ok(locked);if(failSummary&&this.name==='Check'&&row>1)throw Error('Summary unavailable');for(let i=0;i<n;i++){this.rows[row+i-1]??=[];for(let j=0;j<m;j++)this.rows[row+i-1][col+j-1]=values[i][j];}},
      sort(){},setNumberFormat(){}
    };}
  }
  const rx={console,Logger:{log(){}},LockService:{getScriptLock:()=>({waitLock(){locked=true;},releaseLock(){locked=false;}})},SpreadsheetApp:{openById:()=>({getSheetByName:name=>sheets.get(name),insertSheet:name=>{assert.ok(locked);const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;}}),flush(){flushes++;if(failFlush)throw Error('Flush unavailable');}},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}};
  vm.createContext(rx);vm.runInContext(receiverSource,rx);
  const payload=Object.assign({},posted,{completedAt:'2026-09-20T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(flushes,1);assert.equal(locked,false);
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(sheets.get('Raw Data').getLastRow(),2);
  const newer=Object.assign({},payload,{assessmentId:'ffc-newer',completedAt:'2026-09-21T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(newer).ok,true);
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(sheets.get('Check').rows[1][10],'ffc-newer');
  failSummary=true;
  const retry=Object.assign({},payload,{assessmentId:'ffc-repair',completedAt:'2026-09-22T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(retry).ok,false);failSummary=false;
  assert.equal(rx.handleFactFlowCheck(retry).ok,true);
  assert.equal(sheets.get('Raw Data').getLastRow(),4);
  assert.equal(sheets.get('Check').rows[1][10],'ffc-repair');
  failFlush=true;assert.equal(rx.handleFactFlowCheck(retry).ok,false);failFlush=false;
  assert.equal(rx.handleFactFlowCheck(retry).ok,true);
  for(const bad of [{teacherKey:'TYPO'},{correct:50},{expectedSpreadsheetId:'WRONG'},{assessmentId:''},{studentName:''},{missedFacts:[{}]}]) {
    assert.equal(rx.handleFactFlowCheck(Object.assign({},payload,bad)).ok,false);
  }
  assert.equal(sheets.get('Raw Data').getLastRow(),4);
  const legacy=Object.assign({},payload,{classCode:'IP5/8'});delete legacy.app;delete legacy.teacherKey;delete legacy.assessmentId;
  assert.equal(rx.handleFactFlowCheck(legacy).ok,true);
  assert.equal(rx.handleFactFlowCheck(legacy).ok,true);
  assert.equal(sheets.get('Raw Data').getLastRow(),5);
  assert.equal(rx.checkCell('=1+1'),"'=1+1");
  const practice=rx.doPost({postData:{contents:JSON.stringify({app:'FactFlowPractice',teacherKey:'IP5/8',roundId:'round-1',studentName:'Practice Student'})}});
  assert.equal(practice.ok,true);assert.equal(practice.receiver,'factflow-practice-v1');assert.ok(practice.spreadsheetId);
  assert.equal(sheets.get('Raw Data').getLastRow(),5);
  assert.ok(sheets.has('FactFlow Practice'));
  const peer=__dirname+'/../FactFlow/factflow-practice-apps-script.gs';
  if(fs.existsSync(peer))assert.equal(fs.readFileSync(peer,'utf8'),receiverSource);
  console.log('PASS: scoring, adaptive paths, incomplete coverage, routes, failed/reloaded submissions, receipts, duplicate/stale retries, partial-write recovery, validation, and separate practice reporting.');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
