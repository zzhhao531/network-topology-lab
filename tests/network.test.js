import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shortestPath, spanningTree, makeTopology} from '../src/network.js';
import {topics} from '../src/topics.js';
test('routes recalculate on failure and report unreachable',()=>{const e=[[0,1],[1,2],[0,3],[3,2]];assert.deepEqual(shortestPath(4,e,0,2),[0,1,2]);assert.deepEqual(shortestPath(4,e.filter(([a,b])=>a!==0||b!==1),0,2),[0,3,2]);assert.deepEqual(shortestPath(3,[[0,1]],0,2),[]);assert.deepEqual(shortestPath(3,[],1,1),[1]);});
test('spanning tree breaks cycles while keeping all nodes reachable',()=>{const e=makeTopology('mesh',6);assert.equal(e.length,15);const t=spanningTree(6,e);assert.equal(t.length,5);for(let i=0;i<6;i++)assert.ok(shortestPath(6,t,0,i).length);});
test('topology counts describe star, ring, bus, tree',()=>{for(const type of ['star','bus','tree'])assert.equal(makeTopology(type,6).length,5);assert.equal(makeTopology('ring',6).length,6);});
test('six topology experiments explain their simplifications',()=>{assert.equal(topics.length,6);for(const t of topics){assert.ok(t.steps.length>=4);assert.ok(t.note);}});
