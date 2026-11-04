export function makeTopology(type,n=6){
 if(type==='mesh'){const e=[];for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)e.push([a,b]);return e;}
 if(type==='star')return Array.from({length:n-1},(_,i)=>[0,i+1]);
 if(type==='tree')return Array.from({length:n-1},(_,i)=>[Math.floor(i/2),i+1]);
 const e=Array.from({length:n-1},(_,i)=>[i,i+1]);if(type==='ring'&&n>2)e.push([n-1,0]);return e;
}
export function shortestPath(n,edges,start,end){
 if(start<0||start>=n||end<0||end>=n)return [];
 const q=[[start]],seen=new Set([start]);while(q.length){const path=q.shift(),last=path.at(-1);if(last===end)return path;for(const [a,b]of edges){const next=a===last?b:b===last?a:-1;if(next>=0&&!seen.has(next)){seen.add(next);q.push([...path,next]);}}}return [];
}
export function spanningTree(n,edges){
 const parents=Array.from({length:n},(_,i)=>i),find=x=>parents[x]===x?x:(parents[x]=find(parents[x]));const tree=[];
 for(const [a,b]of edges){const x=find(a),y=find(b);if(x!==y){parents[x]=y;tree.push([a,b]);}}return tree;
}
