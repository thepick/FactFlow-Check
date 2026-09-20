// Run with: node test.cjs (no dependencies or live Google requests).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const source = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('var BANDS'));
const receiverSource = fs.readFileSync(__dirname + '/factflow-apps-script.gs', 'utf8');
const names = 'appState,el,BANDS,WARMUP,evaluateBandAnswers,buildFinalResult,beginBand,presentNextQuestion,submitAnswer,handleTimeout,hasPendingResults,sendResults,init,renderResult,clearSavedResults,continueAssessment,restoreSession,interruptQuestion,repeatIntroduction,startAssessment,normalizeConditions,recordAnswer,handleKey,showBreak,tickSectionCountdown,fourHourCodeInfo';
function load(search = '?t=IP5/8', saved = new Map(), liveDelivery = false) {
  let now = Date.parse('2026-09-20T03:00:00Z'), nextTimer = 0;
  const timers = new Map(), elements = new Map();
  const element = () => ({value:'',textContent:'',innerHTML:'',style:{},parentElement:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},setAttribute(){},addEventListener(){},focus(){}});
  const context = {FactGroups:require('./assessment.js'),URLSearchParams,AbortController,Promise,console,Date:class extends Date { constructor(...args){super(...(args.length?args:[now]));} static now(){return now;} },
    window:{location:{search},setTimeout(fn,ms){timers.set(++nextTimer,{fn,ms});return nextTimer;},clearTimeout(id){timers.delete(id);},setInterval(){return 0;},clearInterval(){},addEventListener(){},confirm(){return true;}},
    document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelectorAll(){return [];},addEventListener(){}},
    localStorage:{getItem(key){return saved.get(key)||null;},setItem(key,value){saved.set(key,value);}},
    fetch:async()=>{throw Error('Offline');}
  };
  vm.createContext(context);
  vm.runInContext(source.replace('var PREVIEW_MODE = true;', 'var PREVIEW_MODE = '+(!liveDelivery)+';').replace('    init();', `globalThis.api = {${names}};`),context);
  context.api.init();
  return Object.assign(context,{saved,timers,advance(ms){now+=ms;},drain(){for(const [id,t] of timers){if(t.ms<1000){timers.delete(id);t.fn();}}}});
}
function answer(i, correct=true, retest=false) {return {phase:'band',bandId:'B',fact:'3 x 4',familyKey:String(i),correct,category:correct?'fluent':'not_secure',timeout:false,retest};}
function session(c,conditions={}) {return {id:'ffc-test-1',appVersion:'3.0.0-preview',studentName:'Test Student',teacherKey:'IP5/8',code:'TEST-10',assessmentName:'Snapshot',attemptKey:'test',startedAt:new Date().toISOString(),startMs:c.Date.now(),phase:'warmup',currentBandIndex:-1,currentBandId:'Introduction',blockQueue:c.api.WARMUP.slice(),questionResults:[],bandResults:[],conditions:c.api.normalizeConditions(conditions),maxQuestions:c.FactGroups.budget(),pendingExtras:[],stage:'initial',breaks:[],interruptions:[],activeMs:0};}


async function run() {
  const c=load('?t=IP5/8',new Map(),true),a=c.api,engine=require('./assessment.js');
  assert.equal(engine.budget(true),102);assert.equal(engine.budget(false),102);
  // Every generated sample covers all component tables and has no reversed duplicates.
  for(let seed=0;seed<100;seed++) for(const g of engine.groups) {
    let state=seed+1;const random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);
    const base=engine.select(g,g.blockSize,[],random),extra=engine.select(g,g.extraSize,base,random);
    assert.equal(new Set(base.concat(extra).map(q=>q.familyKey)).size,base.length+extra.length);
    assert.deepEqual([...new Set(base.map(q=>q.table))].sort((a,b)=>a-b),g.tables);
    for(const t of g.tables) {
      const count=base.filter(q=>q.table===t).length;
      assert.ok(count>=Math.floor(base.length/g.tables.length));
    }
    if(g.tables.length===1)assert.equal(new Set(base.map(q=>Math.min(2,Math.floor((q.b-2)/4)))).size,3);
  }
  function simulate(mode,conditions={}) {
    const sim=load();const api=sim.api;api.appState.session=session(sim,conditions);api.presentNextQuestion();
    let n=0,guard=0;
    while(api.appState.session){assert.ok(++guard<250);const s=api.appState.session;
      if(s.paused){api.continueAssessment(true);continue;}
      const band=s.currentBandId,within=s.questionResults.filter(q=>q.phase===s.phase&&q.bandId===band).length;
      let wrong=(mode==='screenshot'&&((s.phase==='warmup'&&within===0)||(band==='A'&&within===0)))||
        (mode==='uneven'&&band==='D'&&within<3)||(mode==='extras'&&s.phase==='band'&&band!=='H'&&within<2)||mode==='wrong';
      if(mode==='extras'&&s.phase==='band'&&band!=='H'&&within<2)api.recordAnswer('',false,true);
      else if(mode==='timeout') {sim.advance(10000);api.handleTimeout();}
      else if(mode==='skip')api.recordAnswer('',false,true);
      else {api.el.answerInput.value=String(api.appState.currentQuestion.answer+(wrong?1:0));sim.advance(mode==='slow'?6000:1500);api.submitAnswer();}
      sim.drain();n++;assert.ok(n<=102);
    }
    return api.appState.latestResult;
  }
  const fullResult=simulate('perfect');
  assert.equal(fullResult.countedQuestions,78);assert.equal(fullResult.totalQuestions,74);
  assert.ok(fullResult.bandResults.every(b=>b.verdict==='pass'));assert.equal(fullResult.submissionStatus,'preview');
  for(const mode of ['screenshot','uneven','extras','wrong','timeout','skip','slow']) {
    const r=simulate(mode);assert.equal(r.bandResults.length,8);assert.ok(r.bandResults.every(b=>b.questions>0));
    if(mode==='screenshot')assert.ok(r.bandResults.every(b=>b.verdict==='pass'));
    if(mode==='uneven'){assert.equal(r.bandResults[3].verdict,'fail');assert.equal(r.bandResults[5].verdict,'pass');}
    if(mode==='extras'){
      assert.equal(r.countedQuestions,102);
      const order=r.questionResults.map(q=>q.bandId).filter((id,i,all)=>i===0||id!==all[i-1]);
      assert.equal(order.join(','),'A,B,C,D,E,F,G,H');
      assert.ok(r.breaks.some(b=>b.reason==='A few more questions'));
    }
    if(mode==='wrong')assert.ok(r.bandResults.every(b=>b.verdict==='fail'));
    if(mode==='timeout'||mode==='skip')assert.ok(r.bandResults.every(b=>b.verdict==='incomplete'));
    if(mode==='slow'){assert.ok(r.bandResults.every(b=>b.verdict==='slow'));assert.ok(r.activeSec>400);}
  }
  for(const conditions of [{mode:'extended'},{mode:'untimed'},{input:'teacher'}]){
    const r=simulate('slow',conditions);assert.equal(r.fluent,0);assert.ok(r.bandResults.every(b=>b.verdict==='accuracy_only'));
  }
  const oldSettings=simulate('perfect',{mixed:false});assert.equal(oldSettings.bandResults[7].verdict,'pass');assert.equal(oldSettings.bandResults[7].questions,18);assert.equal(oldSettings.conditions.mixed,true);assert.match(oldSettings.bandResults[7].label,/Final challenge/);
  // Ending during an extra block must include the new evidence, not its stale initial summary.
  const partial=load(),ps=session(partial);partial.api.appState.session=ps;
  ps.bandResults=[{bandId:'A',label:engine.groups[0].label,questions:8,correct:6,fluent:6,slow:0,wrong:0,timeout:2,skipped:0,tables:[2,5,10],verdict:'incomplete'}];
  ps.questionResults=Array.from({length:10},(_,i)=>Object.assign(answer(i),{bandId:'A',table:2}));
  const pr=partial.api.buildFinalResult(ps);assert.equal(pr.bandResults[0].questions,10);assert.equal(pr.bandResults[0].verdict,'incomplete');
  // Preview never submits even an old pending result.
  const isolated=load();let calls=0;isolated.fetch=()=>{calls++;throw Error('Must not send');};isolated.api.appState.latestResult=Object.assign({},fullResult,{submissionStatus:'pending'});await isolated.api.sendResults();assert.equal(calls,0);
  // Shared devices agree on a class/window; date and class vary the mixed code schedule.
  const other=load('?t=IP5/9'),same=load('?t=IP5/8');let previous=null,wordChanges=new Set();
  for(let day=1;day<=31;day++){
    const date=new Date(Date.UTC(2026,8,day,3)),code=a.fourHourCodeInfo(date).code;
    assert.match(code,/^[A-Z]+-[0-9]{4}$/);assert.equal(code,same.api.fourHourCodeInfo(date).code);
    assert.notEqual(code,other.api.fourHourCodeInfo(date).code);assert.notEqual(code,previous);previous=code;wordChanges.add(code.split('-')[0]);
  }
  assert.ok(wordChanges.size>10);
  assert.equal(a.fourHourCodeInfo(new Date('2026-09-20T03:00:00Z')).code,a.fourHourCodeInfo(new Date('2026-09-20T04:59:00Z')).code);
  assert.notEqual(a.fourHourCodeInfo(new Date('2026-09-20T04:59:00Z')).code,a.fourHourCodeInfo(new Date('2026-09-20T05:00:00Z')).code);
  // Section countdown advances once after ten seconds; Continue can start sooner.
  function section(){const e=load();e.api.appState.session=session(e);e.api.appState.session.nextBlock={index:0,extra:false};e.api.showBreak('Section complete','Next group');return e;}
  const countdown=section();assert.match(countdown.api.el.sectionCountdown.textContent,/10 seconds/);countdown.advance(9000);countdown.api.tickSectionCountdown();assert.equal(countdown.api.appState.session.paused,true);assert.match(countdown.api.el.sectionCountdown.textContent,/1 second/);countdown.advance(1000);countdown.api.tickSectionCountdown();assert.equal(countdown.api.appState.session.paused,false);const first=countdown.api.appState.currentQuestion;countdown.api.tickSectionCountdown();assert.equal(countdown.api.appState.currentQuestion,first);
  const early=section();early.api.continueAssessment(false);early.advance(10000);early.api.tickSectionCountdown();assert.equal(early.api.appState.session.currentBandIndex,0);assert.equal(early.api.appState.session.questionResults.length,0);
  const hidden=section();hidden.document.hidden=true;hidden.advance(10000);hidden.api.tickSectionCountdown();assert.equal(hidden.api.appState.session.paused,true);hidden.document.hidden=false;hidden.api.tickSectionCountdown();assert.equal(hidden.api.appState.session.paused,false);
  const interrupted=section();interrupted.api.appState.session.needsTeacherCheck=true;interrupted.advance(10000);interrupted.api.tickSectionCountdown();assert.equal(interrupted.api.appState.session.paused,true);
  // Automatic keyboard/keypad entry preserves valid prefixes and cancels stale timers.
  function entry(answerValue){const e=load();e.api.appState.session=session(e);e.api.presentNextQuestion();e.api.appState.currentQuestion.answer=answerValue;return e;}
  const auto=entry(144);auto.api.handleKey('1');assert.equal(auto.api.appState.autoSubmitId,null);auto.api.handleKey('4');assert.equal(auto.api.appState.autoSubmitId,null);auto.api.handleKey('4');assert.equal(auto.timers.get(auto.api.appState.autoSubmitId).ms,120);auto.advance(1500);auto.drain();assert.equal(auto.api.appState.session.questionResults[0].correct,true);
  const wrong=entry(24);wrong.api.handleKey('7');assert.equal(wrong.timers.get(wrong.api.appState.autoSubmitId).ms,500);wrong.api.handleKey('backspace');assert.equal(wrong.api.appState.autoSubmitId,null);wrong.drain();assert.equal(wrong.api.appState.session.questionResults.length,0);wrong.api.handleKey('2');wrong.api.handleKey('4');wrong.api.handleKey('clear');wrong.drain();assert.equal(wrong.api.appState.session.questionResults.length,0);
  const longer=entry(144);longer.api.handleKey('9');assert.equal(longer.timers.get(longer.api.appState.autoSubmitId).ms,700);longer.drain();assert.equal(longer.api.appState.session.questionResults[0].correct,false);
  const once=entry(8);once.api.handleKey('8');once.api.submitAnswer();once.drain();assert.equal(once.api.appState.session.questionResults.length,1);
  // Deadline enforcement also applies if a backgrounded timer callback runs late.
  const timed=load();timed.api.appState.session=session(timed);timed.api.presentNextQuestion();
  timed.api.el.answerInput.value=String(timed.api.appState.currentQuestion.answer);timed.advance(10001);timed.api.submitAnswer();
  assert.equal(timed.api.appState.session.questionResults[0].timeout,true);
  // Durable in-flight recovery replaces an exposed fact, does not score an interruption.
  const live=load();live.api.appState.session=session(live);live.api.beginBand(0,false);
  const exposed=live.api.appState.currentQuestion.familyKey;
  const restoredLive=load('?t=IP5/8',live.saved);assert.equal(restoredLive.api.el.recoveryNotice.hidden,false);
  restoredLive.api.restoreSession();assert.equal(restoredLive.api.appState.session.interruptions.length,1);
  assert.equal(restoredLive.api.appState.session.questionResults.length,0);restoredLive.api.continueAssessment(true);
  assert.notEqual(restoredLive.api.appState.currentQuestion.familyKey,exposed);
  restoredLive.api.el.answerInput.value=String(restoredLive.api.appState.currentQuestion.answer);restoredLive.advance(1500);restoredLive.api.submitAnswer();
  const checkpoint=JSON.parse(restoredLive.saved.get('factflowCheck.session.v3|IP5/8'));assert.equal(checkpoint.questionResults.length,1);assert.equal(checkpoint.pendingQuestion,undefined);
  // Repeating the introduction never consumes the scored budget or awards a group.
  const intro=load();intro.api.appState.session=session(intro);intro.api.appState.session.paused=true;intro.api.appState.session.questionResults=[{phase:'warmup'}];intro.api.repeatIntroduction();assert.equal(intro.api.appState.session.questionResults.length,0);
  for(const route of ['?t=TYPO','?t=','?t=__proto__','?t=%ZZ']) {assert.equal(load(route).activeTeacher,null);assert.ok(load(route).routeError);}
  assert.equal(load('').activeTeacher.key,'IP5/9');assert.equal(load('?t=ip5%2F8').activeTeacher.key,'IP5/8');

  // Persist failure, restore it after reload, and only accept an exact receipt.
  let result=Object.assign({},fullResult,{submissionStatus:'pending'});
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
  const restored=load('?t=IP5/9',c.saved,true);
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
  const blockedStorage=load('?t=IP5/8',new Map(),true);
  const unsaved=Object.assign({},fullResult,{submissionStatus:'pending'});
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
      setValues:values=>{assert.ok(locked);if(failSummary&&this.name==='Check v3'&&row>1)throw Error('Summary unavailable');for(let i=0;i<n;i++){this.rows[row+i-1]??=[];for(let j=0;j<m;j++)this.rows[row+i-1][col+j-1]=values[i][j];}},
      sort(){},setNumberFormat(){}
    };}
  }
  const rx={console,Logger:{log(){}},LockService:{getScriptLock:()=>({waitLock(){locked=true;},releaseLock(){locked=false;}})},SpreadsheetApp:{openById:()=>({getSheetByName:name=>sheets.get(name),insertSheet:name=>{assert.ok(locked);const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;}}),flush(){flushes++;if(failFlush)throw Error('Flush unavailable');}},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}};
  vm.createContext(rx);vm.runInContext(receiverSource,rx);
  const payload=Object.assign({},posted,{completedAt:'2026-09-20T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(flushes,1);assert.equal(locked,false);
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(sheets.get('Check Raw v3').getLastRow(),2);
  for(const bad of [{schemaVersion:9},{skipped:-1},{conditions:{mode:'extended',input:'student',mixed:true,hideTimer:false}},{bandResults:payload.bandResults.slice(1)},{totalQuestions:99},{accuracy:1}])assert.equal(rx.handleFactFlowCheck(Object.assign({},payload,bad)).ok,false);
  const newer=Object.assign({},payload,{assessmentId:'ffc-newer',completedAt:'2026-09-21T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(newer).ok,true);
  assert.equal(rx.handleFactFlowCheck(payload).ok,true);
  assert.equal(sheets.get('Check v3').rows[1][10],'ffc-newer');
  failSummary=true;
  const retry=Object.assign({},payload,{assessmentId:'ffc-repair',completedAt:'2026-09-22T03:00:00Z'});
  assert.equal(rx.handleFactFlowCheck(retry).ok,false);failSummary=false;
  assert.equal(rx.handleFactFlowCheck(retry).ok,true);
  assert.equal(sheets.get('Check Raw v3').getLastRow(),4);
  assert.equal(sheets.get('Check v3').rows[1][10],'ffc-repair');
  failFlush=true;assert.equal(rx.handleFactFlowCheck(retry).ok,false);failFlush=false;
  assert.equal(rx.handleFactFlowCheck(retry).ok,true);
  for(const bad of [{teacherKey:'TYPO'},{correct:50},{expectedSpreadsheetId:'WRONG'},{assessmentId:''},{studentName:''},{missedFacts:[{}]}]) {
    assert.equal(rx.handleFactFlowCheck(Object.assign({},payload,bad)).ok,false);
  }
  assert.equal(sheets.get('Check Raw v3').getLastRow(),4);
  const legacy=Object.assign({},payload,{classCode:'IP5/8',schemaVersion:2,totalQuestions:8,correct:8,fluent:8,slow:0,wrong:0,timeout:0,accuracy:100,bandResults:[]});delete legacy.app;delete legacy.teacherKey;delete legacy.assessmentId;
  assert.equal(rx.handleFactFlowCheck(legacy).ok,true);
  assert.equal(rx.handleFactFlowCheck(legacy).ok,true);
  assert.equal(sheets.get('Raw Data').getLastRow(),2);assert.equal(sheets.get('Check Raw v3').getLastRow(),4);
  assert.equal(rx.checkCell('=1+1'),"'=1+1");
  const practice=rx.doPost({postData:{contents:JSON.stringify({app:'FactFlowPractice',teacherKey:'IP5/8',roundId:'round-1',studentName:'Practice Student'})}});
  assert.equal(practice.ok,true);assert.equal(practice.receiver,'factflow-practice-v1');assert.ok(practice.spreadsheetId);
  assert.equal(sheets.get('Raw Data').getLastRow(),2);assert.equal(sheets.get('Check Raw v3').getLastRow(),4);
  assert.ok(sheets.has('FactFlow Practice'));
  const peer=__dirname+'/../FactFlow/factflow-practice-apps-script.gs';
  if(fs.existsSync(peer))assert.equal(fs.readFileSync(peer,'utf8'),receiverSource);
  console.log('PASS: independent groups; 102-question budget; 800 balanced samples; all ability/condition paths; strict timing; interruption recovery; preview isolation; receiver compatibility and delivery recovery.');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
