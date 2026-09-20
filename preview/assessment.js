/* Shared assessment rules: browser and dependency-free tests use this same code. */
(function (root) {
  'use strict';
  var groups = [
    ['A', '2s, 5s & 10s', [2,5,10]], ['B', '3s & 4s', [3,4]],
    ['C', '6s', [6]], ['D', '7s', [7]], ['E', '8s', [8]],
    ['F', '9s', [9]], ['G', '11s & 12s', [11,12]],
    ['H', 'Final challenge: mixed facts 2–12', [2,3,4,5,6,7,8,9,10,11,12]]
  ].map(function (g) { return { id:g[0], label:g[1], tables:g[2], blockSize:g[0]==='H'?18:8,
    extraSize:g[0]==='H'?0:g[2].length===1?3:4 }; });
  function pool(group) {
    var facts=[];
    group.tables.forEach(function (table) {
      for(var multiplier=2;multiplier<=12;multiplier++) facts.push({a:table,b:multiplier,table:table,
        answer:table*multiplier, familyKey:[table,multiplier].sort(function(a,b){return a-b;}).join('x'),
        display:table+' x '+multiplier});
    });
    return facts;
  }
  function select(group,count,previous,random) {
    random=random||Math.random;
    var used=new Set(),counts={},ranges={},out=[];
    function record(fact){used.add(fact.familyKey);counts[fact.table]=(counts[fact.table]||0)+1;
      var key=fact.table+':'+Math.min(2,Math.floor((fact.b-2)/4));ranges[key]=(ranges[key]||0)+1;}
    previous.forEach(record);
    for(var i=0;i<count;i++) {
      var choices=pool(group).filter(function(f){return !used.has(f.familyKey);}).map(function(f){
        return {fact:f,weight:(counts[f.table]||0)*100+(ranges[f.table+':'+Math.min(2,Math.floor((f.b-2)/4))]||0)*10+random()};
      }).sort(function(a,b){return a.weight-b.weight;});
      if(!choices.length) throw new Error('Not enough unique facts for '+group.label);
      var chosen=choices[0].fact;record(chosen);out.push(chosen);
    }
    return out;
  }
  function budget() {return 4+groups.reduce(function(n,g){return n+g.blockSize+g.extraSize;},0);}
  function assess(group,answers,extra,standard) {
    var n=answers.length, correct=answers.filter(function(a){return a.correct;}).length;
    var wrong=answers.filter(function(a){return !a.correct&&!a.timeout&&!a.skipped;}).length;
    var target=group.blockSize+(extra?group.extraSize:0);
    var maximum=group.blockSize+group.extraSize;
    // Only actual incorrect answers establish difficulty. Missing responses leave uncertainty.
    if(group.id!=='H'&&n>=6&&maximum-wrong<Math.ceil(maximum*0.83)) return 'fail';
    if(n<target) return 'incomplete';
    var accuracyRequired=Math.ceil(n*(group.id==='H'?0.85:0.83));
    if(correct>=accuracyRequired) {
      if(!standard) return 'accuracy_only';
      var fluent=answers.filter(function(a){return a.category==='fluent';}).length;
      var fluencyRequired=group.id==='H'?Math.ceil(n*0.66):extra?Math.ceil(n*0.55):5;
      return fluent>=fluencyRequired?'pass':'slow';
    }
    if(!extra&&group.extraSize) return 'extra';
    return n-wrong<accuracyRequired?'fail':'incomplete';
  }
  var api={groups:groups,select:select,budget:budget,assess:assess};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.FactGroups=api;
})(typeof window!=='undefined'?window:this);
