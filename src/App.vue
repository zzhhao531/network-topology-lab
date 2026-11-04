<script setup>
import {ref,computed,watch,onMounted,onUnmounted} from 'vue';
import {config} from './config.js';import {topics} from './topics.js';import Lab from './Lab.vue';
const initial=()=>{try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}};
const selected=ref(topics.some(t=>t.id===initial())?initial():topics[0].id),query=ref(''),step=ref(0),playing=ref(false),speed=ref(1),answer=ref(false);
const current=computed(()=>topics.find(t=>t.id===selected.value)||topics[0]);
const filtered=computed(()=>topics.filter(t=>(t.title+t.tag+t.summary).toLowerCase().includes(query.value.toLowerCase())));
let timer;
function documentFocus(){document.getElementById('experiment').focus();}
function stop(){playing.value=false;clearInterval(timer);}
function go(n){stop();step.value=Math.max(0,Math.min(current.value.steps.length-1,Number(n)));}
function play(){if(playing.value){stop();return;}if(step.value===current.value.steps.length-1)step.value=0;playing.value=true;timer=setInterval(()=>{if(step.value>=current.value.steps.length-1){stop();return;}step.value++;if(step.value===current.value.steps.length-1)stop();},1600/Number(speed.value));}
function choose(id){selected.value=id;location.hash=id;}
function hash(){let id;try{id=initial();}catch{id='';}selected.value=topics.some(t=>t.id===id)?id:topics[0].id;}
function key(e){if(e.ctrlKey||e.altKey||e.metaKey||/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(e.target.tagName)||e.target.isContentEditable)return;if(e.code==='Space'){e.preventDefault();play();}if(e.key==='ArrowRight'){e.preventDefault();go(step.value+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(step.value-1);}if(e.key.toLowerCase()==='r')go(0);}
watch(selected,()=>{stop();step.value=0;answer.value=false;document.title=current.value.title+' · '+config.title;});
watch(speed,()=>{if(playing.value){stop();play();}});
onMounted(()=>{window.addEventListener('keydown',key);window.addEventListener('hashchange',hash);});onUnmounted(()=>{stop();window.removeEventListener('keydown',key);window.removeEventListener('hashchange',hash);});
</script>
<template>
 <a class="skip" href="#experiment" @click.prevent="documentFocus">跳到实验区</a>
 <header><a class="brand" :href="`/${config.name}/`"><span class="brand-icon">{{config.topology?'拓扑':'网络'}}</span><span>{{config.title}}<small>zzhhao531 的学习实验室</small></span></a><nav><a :href="`https://zzhhao531.github.io/${config.other}/`">{{config.otherTitle}} ↗</a><a :href="`https://github.com/zzhhao531/${config.name}`">GitHub ↗</a></nav></header>
 <div class="workspace">
 <aside><div class="aside-label">学习目录 <span>{{topics.length}} 个实验</span></div><label class="search">⌕ <input v-model="query" placeholder="搜索知识点…" aria-label="搜索知识点"></label><div class="topic-list"><button v-for="(t,i) in filtered" :key="t.id" :class="{active:selected===t.id}" @click="choose(t.id)" :aria-current="selected===t.id?'page':undefined"><span class="topic-no">{{String(topics.indexOf(t)+1).padStart(2,'0')}}</span><span><small>{{t.tag}}</small>{{t.title}}</span><span class="arrow">↗</span></button><p v-if="!filtered.length" class="empty">没有匹配的实验。试试 TCP、拓扑或网络。</p></div><div class="aside-bottom"><i></i> 在浏览器里动手理解网络<p>原创交互演示 · zzhhao531</p></div></aside>
 <main id="experiment" tabindex="-1"><div class="eyebrow">计算机网络 <span>/ {{config.topology?'拓扑与连接':'原理与协议'}}</span></div><h1>{{config.title}}</h1><p class="intro">{{config.topology?'比较不同连接方式，试着断开一条链路，看看数据还能不能到达。':'通过分步演示，了解数据传输、协议协作与路由选择。'}}</p>
 <section class="experiment"><div class="experiment-heading"><div><span class="pill">{{current.tag}}</span><h2>{{current.title}}</h2><p>{{current.summary}}</p></div><span class="live"><i></i> 可交互实验</span></div>
 <Lab :key="current.id" :topic="current" :step="step"/>
 <div class="controls"><button class="play" @click="play">{{playing?'Ⅱ 暂停':'▶ 播放'}}</button><button @click="go(step-1)" :disabled="step===0" aria-label="上一步">←</button><button @click="go(step+1)" :disabled="step===current.steps.length-1" aria-label="下一步">→</button><button @click="go(0)" aria-label="重置">↺</button><label class="timeline"><span class="sr-only">实验进度</span><input type="range" min="0" :max="current.steps.length-1" :value="step" @input="go($event.target.value)" aria-label="实验进度"></label><span class="count">{{step+1}} / {{current.steps.length}}</span><label><span class="sr-only">播放速度</span><select v-model="speed" aria-label="播放速度"><option :value="0.5">0.5×</option><option :value="1">1×</option><option :value="2">2×</option></select></label></div>
 <div class="caption" aria-live="polite"><span>第 {{step+1}} 步</span><p>{{current.steps[step]}}</p></div></section>
 <div class="below"><section class="knowledge"><div class="eyebrow">想一想</div><h3>{{current.question}}</h3><button class="answer-button" @click="answer=!answer">{{answer?'收起解析':'查看解析'}}</button><p v-if="answer" class="answer">{{current.answer}}</p></section><section class="boundary"><div class="eyebrow">模型说明</div><p>{{current.note}}</p><small>快捷键：空格 播放/暂停 · ← → 切步 · R 重置</small></section></div><footer> {{config.title}}<a :href="`https://zzhhao531.github.io/${config.other}/`">继续探索{{config.otherTitle}} →</a></footer>
 </main></div>
</template>
