<script setup>
import {ref,computed,watch,onMounted,onUnmounted} from 'vue';
import {config} from './config.js';import {topics} from './topics.js';import Lab from './Lab.vue';import Icon from './Icon.vue';
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
 <header class="site-header">
  <a class="brand" :href="`/${config.name}/`"><span class="brand-icon"><Icon name="network" :size="24"/></span><span>{{config.title}}<small>zzhhao531 的学习实验室</small></span></a>
  <nav aria-label="站点导航"><a :href="`https://zzhhao531.github.io/${config.other}/`">{{config.otherTitle}}<Icon name="external" :size="14"/></a><a :href="`https://github.com/zzhhao531/${config.name}`">GitHub<Icon name="external" :size="14"/></a></nav>
 </header>
 <div class="workspace">
  <aside class="catalog"><div class="aside-label">实验目录<span>{{topics.length}} 个实验</span></div>
   <label class="search"><Icon name="search" :size="17"/><input v-model="query" placeholder="搜索实验" aria-label="搜索知识点"></label>
   <nav class="topic-list" aria-label="实验目录"><button v-for="t in filtered" :key="t.id" :class="{active:selected===t.id}" @click="choose(t.id)" :aria-current="selected===t.id?'page':undefined"><span class="topic-mark"></span><span><small>{{t.tag}}</small>{{t.title}}</span><Icon v-if="selected===t.id" name="right" :size="14"/></button><p v-if="!filtered.length" class="empty">没有找到相关实验。换个关键词试试。</p></nav>
   <div class="aside-bottom"><span class="catalog-rule"></span><p>边操作，边理解。</p><small>计算机网络交互学习</small></div>
  </aside>
  <main id="experiment" tabindex="-1">
   <div class="page-heading"><div><h1>{{current.title}}</h1><p class="intro">{{current.summary}}</p></div><span class="topic-tag">{{current.tag}}</span></div>
   <div class="lab-layout">
    <section class="experiment" aria-label="交互实验">
     <Lab :key="current.id" :topic="current" :step="step"/>
     <div class="controls"><div class="transport"><button class="play" @click="play"><Icon :name="playing?'pause':'play'" :size="17"/>{{playing?'暂停':'播放'}}</button><button class="icon-button" @click="go(step-1)" :disabled="step===0" aria-label="上一步" title="上一步"><Icon name="left"/></button><button class="icon-button" @click="go(step+1)" :disabled="step===current.steps.length-1" aria-label="下一步" title="下一步"><Icon name="right"/></button><button class="icon-button" @click="go(0)" aria-label="重置" title="重置"><Icon name="reset" :size="17"/></button></div>
      <label class="timeline"><span class="sr-only">实验进度</span><input type="range" min="0" :max="current.steps.length-1" :value="step" @input="go($event.target.value)" aria-label="实验进度"></label><span class="count">{{step+1}} / {{current.steps.length}}</span><label class="speed-label"><span class="sr-only">播放速度</span><select v-model="speed" aria-label="播放速度"><option :value="0.5">0.5×</option><option :value="1">1×</option><option :value="2">2×</option></select></label>
     </div>
     <div class="caption" aria-live="polite"><span class="step-badge">{{String(step+1).padStart(2,'0')}}</span><div><span class="caption-label">当前步骤</span><p>{{current.steps[step]}}</p></div></div>
     <div class="keyboard-hint"><span>按自己的节奏探索</span><span><kbd>空格</kbd> 播放 <kbd>←</kbd><kbd>→</kbd> 切步</span></div>
    </section>
    <section class="lesson-notes" aria-label="实验步骤"><h2>实验过程<span>{{current.steps.length}} 步</span></h2><ol class="step-list"><li v-for="(text,index) in current.steps" :key="index" :class="{current:step===index,passed:step>index}"><button @click="go(index)" :aria-current="step===index?'step':undefined"><span class="step-index"><Icon v-if="index<step" name="check" :size="13"/><template v-else>{{index+1}}</template></span><span>{{text}}</span></button></li></ol></section>
   </div>
   <div class="below"><section class="knowledge"><h2>想一想</h2><h3>{{current.question}}</h3><button class="answer-button" @click="answer=!answer">{{answer?'收起解析':'查看解析'}}<Icon name="right" :size="15" :class="{rotated:answer}"/></button><p v-if="answer" class="answer">{{current.answer}}</p></section><section class="boundary"><h2>模型说明</h2><p>{{current.note}}</p></section></div>
   <footer><span>{{config.title}} · zzhhao531</span><a :href="`https://zzhhao531.github.io/${config.other}/`">前往{{config.otherTitle}}<Icon name="right" :size="14"/></a></footer>
  </main>
 </div>
</template>