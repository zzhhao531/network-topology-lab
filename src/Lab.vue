<script setup>
import {ref,computed} from 'vue';import {makeTopology,shortestPath,spanningTree} from './network.js';
const props=defineProps({topic:Object,step:Number});const shape=ref(props.topic.id==='bus'?'bus':props.topic.id==='ring'?'ring':props.topic.id==='resilience'?'mesh':props.topic.id==='stp'?'mesh':'star');const device=ref('switch'),failed=ref([]),useTree=ref(true),source=ref(props.topic.id==='star'?1:0),target=ref(5);
const edges=computed(()=>makeTopology(shape.value,6));const available=computed(()=>edges.value.filter((_,i)=>!failed.value.includes(i)));const tree=computed(()=>spanningTree(6,available.value));const active=computed(()=>props.topic.id==='stp'&&useTree.value?tree.value:available.value);const path=computed(()=>shortestPath(6,active.value,Number(source.value),Number(target.value)));
const coords=computed(()=>{if(shape.value==='bus')return Array.from({length:6},(_,i)=>({x:70+i*110,y:130}));if(shape.value==='tree')return [{x:345,y:40},{x:190,y:125},{x:500,y:125},{x:100,y:215},{x:270,y:215},{x:560,y:215}];if(shape.value==='star')return [{x:345,y:125},...Array.from({length:5},(_,i)=>({x:345+210*Math.cos(i*2*Math.PI/5-Math.PI/2),y:130+95*Math.sin(i*2*Math.PI/5-Math.PI/2)}))];return Array.from({length:6},(_,i)=>({x:345+225*Math.cos(i*Math.PI/3-Math.PI/2),y:130+105*Math.sin(i*Math.PI/3-Math.PI/2)}));});
function edgeIn(list,a,b){return list.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}
const routeEdges=computed(()=>path.value.slice(1).map((x,i)=>[path.value[i],x]));
function toggle(i){if(props.topic.id==='ring'||props.topic.id==='bus'||props.topic.id==='star')return;failed.value=failed.value.includes(i)?failed.value.filter(x=>x!==i):[...failed.value,i];}
function change(){failed.value=[];}
const currentNode=computed(()=>props.topic.id==='ring'?[0,0,1,2,3,4,5,0][props.step]:path.value[Math.min(props.step,Math.max(0,path.value.length-1))]);
const flood=computed(()=>props.topic.id==='star'&&(device.value==='hub'||props.step===4));
</script>
<template><div class="stage" :class="`stage-${topic.id}`"><div class="stage-toolbar">
 <template v-if="topic.id==='structures'"><button v-for="(label,key) in {star:'星型',bus:'总线',ring:'环型',tree:'树型',mesh:'网状'}" :key="key" :class="{selected:shape===key}" @click="shape=key;change()">{{label}}</button></template>
 <template v-else-if="topic.id==='star'"><button :class="{selected:device==='hub'}" @click="device='hub'">集线器</button><button :class="{selected:device==='switch'}" @click="device='switch'">交换机</button></template>
 <template v-else-if="topic.id==='stp'"><button :class="{selected:useTree}" @click="useTree=!useTree">{{useTree?'生成树：开启':'生成树：关闭'}}</button></template>
 <template v-else-if="topic.id==='resilience'"><label>从 <select v-model="source" aria-label="源节点"><option v-for="i in 6" :key="i" :value="i-1">{{String.fromCharCode(64+i)}}</option></select></label><label>到 <select v-model="target" aria-label="目标节点"><option v-for="i in 6" :key="i" :value="i-1">{{String.fromCharCode(64+i)}}</option></select></label></template>
 <span v-else>{{topic.id==='bus'?'共享半双工介质':'单向逻辑环 · 令牌发送权'}}</span><button v-if="failed.length" @click="failed=[]">恢复全部链路</button><span class="stage-label">{{edges.length}} 段连接 · {{failed.length}} 处故障</span></div>
 <svg viewBox="0 0 690 270" role="img" aria-label="可交互网络拓扑图，链路下方有同等键盘操作控件">
 <g v-for="([a,b],i) in edges" :key="i"><line class="edge" :class="{failed:failed.includes(i),path:!failed.includes(i)&&((topic.id==='stp'&&useTree&&edgeIn(tree,a,b))||edgeIn(routeEdges,a,b)||flood),backup:topic.id==='stp'&&useTree&&!edgeIn(tree,a,b)}" :x1="coords[a].x" :y1="coords[a].y" :x2="coords[b].x" :y2="coords[b].y" @click="toggle(i)"><title>切换 {{String.fromCharCode(65+a)}}–{{String.fromCharCode(65+b)}} 链路</title></line></g>
 <g v-for="(n,i) in coords" :key="i" class="node" :class="{hot:currentNode===i||flood}" :transform="`translate(${n.x},${n.y})`"><circle :r="shape==='star'&&i===0?27:23"/><text y="4">{{shape==='star'&&i===0?'A·中心':String.fromCharCode(65+i)}}</text></g>
 <circle v-if="currentNode!==undefined && !(topic.id==='bus'&&step===2)" class="packet" :cx="coords[currentNode].x+17" :cy="coords[currentNode].y-21" r="7"/>
 <g v-if="topic.id==='bus'&&step===2"><path d="M320 100L340 125L326 145L358 120L345 110L365 90" fill="none" stroke="#bb6652" stroke-width="5"/><text x="300" y="190">冲突：停止发送</text></g>
 </svg>
 <div class="stage-status" aria-live="polite">{{topic.id==='stp'&&useTree?`活动树 ${tree.length} 条边 / 健康链路 ${available.length} 条` : path.length ? `当前路径：${path.map(i=>String.fromCharCode(65+i)).join(' → ')} · ${path.length-1} 跳`:'不可达：源节点与目标节点之间没有可用路径'}}</div>
 <div class="graph-legend"><span>蓝色：路径　绿色：活动树　红色虚线：故障　灰色虚线：备用</span><span v-if="!['ring','bus','star'].includes(topic.id)">点击连线可切换故障</span></div>
 <details v-if="!['ring','bus','star'].includes(topic.id)" class="edge-options"><summary>用键盘管理链路</summary><div><button v-for="([a,b],i) in edges" :key="i" @click="toggle(i)" :aria-pressed="failed.includes(i)">{{String.fromCharCode(65+a)}}–{{String.fromCharCode(65+b)}} {{failed.includes(i)?'恢复':'断开'}}</button></div></details>
 </div></template>
