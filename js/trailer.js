const W=1280,H=720,cv=document.getElementById('c'),x=cv.getContext('2d'),o=document.getElementById('o'),m=document.getElementById('m');
const I={},S={},D=55;let ac,base,run=false,G,ready=false;
const L=(n)=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=A.i[n];I[n]=i});
Promise.all(Object.keys(A.i).map(L)).then(()=>{ready=true;m.textContent='click to play the trailer'});
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
function pic(n,p,d,fit,z0=1.02,z1=1.17,ox=0){const q=I[n],k=(fit?Math.min:Math.max)(W/q.width,H/q.height)*(z0+(z1-z0)*p/d),w=q.width*k,h=q.height*k;x.imageSmoothingEnabled=true;x.drawImage(q,(W-w)/2+ox*p/d,(H-h)/2,w,h)}
function spr(n,px,py,r,sz){const q=I[n],k=sz/Math.max(q.width,q.height);x.imageSmoothingEnabled=false;x.save();x.translate(px,py);x.rotate(r);x.scale(k,k);x.drawImage(q,-q.width/2,-q.height/2);x.restore()}
function snd(n,v=1){if(!ac)return;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=S[n];g.gain.value=v;s.connect(g).connect(ac.destination);s.start()}
function music(n,at,len,fi,fo,v){const s=ac.createBufferSource(),g=ac.createGain(),t=base+at;s.buffer=S[n];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+fi);g.gain.setValueAtTime(v,t+len-fo);g.gain.linearRampToValueAtTime(0,t+len);s.connect(g).connect(ac.destination);s.start(t);s.stop(t+len)}
async function go(){
 if(!ready||run)return;o.style.display='none';
 ac=ac||new AudioContext();await ac.resume();
 for(const k in A.s)if(!S[k])S[k]=await ac.decodeAudioData(await(await fetch(A.s[k])).arrayBuffer());
 base=ac.currentTime+.15;run=true;resetG();seen={};SH=FL=GL=0;lt=0;
 music('comic',0,16.8,.5,1,.7);music('game',16.5,24,.3,1,.55);music('ending',40,16,1.5,2,.7);
 requestAnimationFrame(frame)}
o.onclick=go;
/* ---------- gameplay simulation (scripted) ---------- */
function resetG(){G={r:rng(7),en:[],bl:[],eb:[],pt:[],a:0,cd:.3,sw:9,hit:true,boss:null,bt:0,shake:0,sp:0,g:0,last:0,P:{x:640,y:380}}}
function stepG(g){
 const s=G,P=s.P,dt=Math.min(.05,g-s.last);s.last=g;if(dt<=0)return;
 const bat=g>=8.5&&g<13.5;s.sp-=dt;
 if(g<13.5&&s.sp<=0){s.sp=bat?.5:.85;const e=s.r()*4|0,u=s.r();let ex,ey;if(e<2){ex=u*W;ey=e?H+60:-60}else{ey=u*H;ex=e==2?-60:W+60}s.en.push({x:ex,y:ey,d:0,t:.6+s.r()})}
 if(g>=13.5&&!s.boss)s.boss={x:W+140,y:330,d:0};
 if(s.boss&&!s.boss.d&&g>=16.1){s.boss.d=1;snd('death',.9);s.shake=1;burst(s,s.boss.x,s.boss.y,50);hit(1.5,1,.9,1.5)}
 let T=null,best=1e9;
 for(const e of s.en)if(!e.d){const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<best){best=d;T=e}}
 if(s.boss&&!s.boss.d){T=s.boss;best=0}
 if(T)s.a+=wrap(Math.atan2(T.y-P.y,T.x-P.x)-s.a)*Math.min(1,dt*14);
 for(const e of s.en){if(e.d)continue;const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy);
  if(d>(bat?60:270)){const v=bat?240:150;e.x+=dx/d*v*dt;e.y+=dy/d*v*dt}
  e.t-=dt;if(!bat&&g<13.5&&e.t<=0&&d<750&&d>200){const a=Math.atan2(dy,dx)+(s.r()-.5)*.5;s.eb.push({x:e.x,y:e.y,vx:Math.cos(a)*620,vy:Math.sin(a)*620,l:1.3});e.t=1.5}}
 const B=s.boss;if(B&&!B.d){B.x+=Math.max(-160*dt,Math.min(0,P.x+340-B.x));s.bt-=dt;
  if(s.bt<=0&&B.x<P.x+420){s.bt=1.15;snd('shotgun',.8);s.shake=.35;const b=Math.atan2(P.y-B.y,P.x-B.x);for(let i=0;i<7;i++){const a=b+(i/6-.5)*.5;s.eb.push({x:B.x,y:B.y,vx:Math.cos(a)*(560+i*12),vy:Math.sin(a)*(560+i*12),l:1})}}}
 s.cd-=dt;
 if(!bat&&T&&s.cd<=0&&Math.abs(wrap(Math.atan2(T.y-P.y,T.x-P.x)-s.a))<.1){s.bl.push({x:P.x+Math.cos(s.a)*60,y:P.y+Math.sin(s.a)*60,vx:Math.cos(s.a)*1400,vy:Math.sin(s.a)*1400,l:1.2});snd('pistol',.6);s.cd=B?.3:.38;s.mf=.08;s.zm=.5;s.shake=Math.max(s.shake,.12)}
 if(bat&&T&&best<150&&s.sw>=.5){s.sw=0;s.hit=false;snd('bat',.8);s.zm=.6}
 if(s.sw<.9)s.sw+=dt;
 if(!s.hit&&s.sw>.2){s.hit=true;let k=0;for(const e of s.en)if(!e.d&&Math.hypot(e.x-P.x,e.y-P.y)<170){e.d=1;k++;burst(s,e.x,e.y,16)}if(k){snd('death',.5);s.shake=.6;hit(.9,.5,.3,.8)}}
 for(const b of s.bl){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;
  for(const e of s.en)if(!e.d&&Math.hypot(e.x-b.x,e.y-b.y)<42){e.d=1;b.l=0;snd('death',.4);burst(s,e.x,e.y,12);s.shake=Math.max(s.shake,.25);break}
  if(B&&!B.d&&Math.hypot(B.x-b.x,B.y-b.y)<80)b.l=0}
 for(const b of s.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(Math.hypot(b.x-P.x,b.y-P.y)<40){b.l=0;s.shake=Math.max(s.shake,.3);burst(s,P.x,P.y,5)}}for(const p of s.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.95;p.vy*=.95;p.l-=dt}s.pt=s.pt.filter(p=>p.l>0);
 s.bl=s.bl.filter(b=>b.l>0);s.eb=s.eb.filter(b=>b.l>0);s.shake=Math.max(0,s.shake-dt);s.zm=Math.max(0,(s.zm||0)-dt*4);s.mf=Math.max(0,(s.mf||0)-dt)}
let pat;
function drawG(g){
 const s=G,P=s.P,bat=g>=8.5&&g<13.5;
 x.save();{const z=1+.06*(s.zm||0);x.translate(W/2,H/2);x.scale(z,z);x.translate(-W/2,-H/2)}if(s.shake>0)x.translate((Math.random()-.5)*14*s.shake*2,(Math.random()-.5)*14*s.shake*2);
 if(!pat){const c=document.createElement('canvas');c.width=c.height=128;c.getContext('2d').drawImage(I.fl,0,0,128,128);pat=x.createPattern(c,'repeat')}
 x.fillStyle=pat;x.fillRect(-20,-20,W+40,H+40);
 [[220,170,.3],[1030,200,1.4],[300,560,2.2],[1010,570,.8]].forEach(t=>spr('tb',t[0],t[1],t[2],150));
 for(const e of s.en)if(e.d)spr('ed',e.x,e.y,Math.atan2(P.y-e.y,P.x-e.x),96);
 if(s.boss&&s.boss.d)spr('bd',s.boss.x,s.boss.y,Math.PI,170);
 for(const e of s.en)if(!e.d)spr('en',e.x,e.y,Math.atan2(P.y-e.y,P.x-e.x),96);
 if(s.boss&&!s.boss.d)spr('bo',s.boss.x,s.boss.y,Math.PI,170);
 if(bat){const f=s.sw<.45?1+Math.min(8,Math.floor(s.sw/.05)):0;spr('b'+(f+1),P.x,P.y,s.a-.785,110)}else spr('pl',P.x,P.y,s.a,110);
 for(const p of s.pt){x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s)}if(s.mf>0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(P.x+Math.cos(s.a)*88,P.y+Math.sin(s.a)*88,22*s.mf/.08,0,7);x.fill()}x.fillStyle='#ffdc64';for(const b of s.bl){x.save();x.translate(b.x,b.y);x.rotate(Math.atan2(b.vy,b.vx));x.fillRect(-24,-1.5,24,3);x.restore()}
 x.fillStyle='#ff5050';for(const b of s.eb){x.save();x.translate(b.x,b.y);x.rotate(Math.atan2(b.vy,b.vx));x.fillRect(-24,-1.5,24,3);x.restore()}
 x.restore();
 const v=x.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,0,10,.75)');x.fillStyle=v;x.fillRect(0,0,W,H)}
function burst(s,px,py,n){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=80+Math.random()*320;s.pt.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.5+Math.random()*.4,s:3+Math.random()*5|0,c:Math.random()<.7?'#c40018':'#ff2a2a'})}}
let SH=0,FL=0,GL=0,lt=0,seen={};
function boom(v=1){if(!ac)return;const t=ac.currentTime,q=ac.createOscillator(),g=ac.createGain();q.frequency.setValueAtTime(110,t);q.frequency.exponentialRampToValueAtTime(30,t+.5);g.gain.setValueAtTime(.9*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.6);q.connect(g).connect(ac.destination);q.start(t);q.stop(t+.7)}
function hit(sh,fl,gl,b){SH=Math.max(SH,sh);FL=Math.max(FL,fl);GL=Math.max(GL,gl);if(b)boom(b)}
const BF=document.createElement('canvas');BF.width=W;BF.height=H;const bx=BF.getContext('2d');let slp;
function post(dt){
 if(GL>.03){bx.drawImage(cv,0,0);for(let i=0;i<8;i++){const y=Math.random()*H|0,h=8+Math.random()*50|0;x.drawImage(BF,0,y,W,h,(Math.random()-.5)*160*GL,y,W,h)}x.globalCompositeOperation='screen';x.fillStyle='rgba(255,45,122,'+.18*GL+')';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}
 if(SH>.03){bx.drawImage(cv,0,0);x.fillStyle='#000';x.fillRect(0,0,W,H);const k=34*SH,z=1+.05*SH;x.save();x.translate(W/2+(Math.random()-.5)*k,H/2+(Math.random()-.5)*k);x.rotate((Math.random()-.5)*.025*SH);x.scale(z,z);x.drawImage(BF,-W/2,-H/2);x.restore()}
 if(FL>.03){x.fillStyle='rgba(255,255,255,'+Math.min(1,FL)+')';x.fillRect(0,0,W,H)}
 if(!slp){const c=document.createElement('canvas');c.width=4;c.height=4;const q=c.getContext('2d');q.fillStyle='#000';q.fillRect(0,0,4,1);slp=x.createPattern(c,'repeat')}
 x.globalAlpha=.16;x.fillStyle=slp;x.fillRect(0,0,W,H);x.globalAlpha=1;
 SH=Math.max(0,SH-dt*3);FL=Math.max(0,FL-dt*5);GL=Math.max(0,GL-dt*4)}
/* ---------- dynamic gameplay v2: moving hero, follow-cam, crowds ---------- */
const WW=2560,WH=1440,CX=1280,CY=720,TB=[[CX,CY,.4],[CX-760,CY-430,1.2],[CX+760,CY-430,2.3],[CX-760,CY+430,.9],[CX+760,CY+430,1.8],[CX-350,CY-560,2],[CX+350,CY+560,.2]];
function resetG(){G={r:rng(11),en:[],bl:[],eb:[],pt:[],a:0,cd:.2,sw:9,hit:true,boss:null,bt:0,shake:0,sp:0,g:0,last:0,hs:0,zm:0,mf:0,o:0,P:{x:CX+440,y:CY},cam:{x:CX+440,y:CY}}}
function stepG(g){
 const s=G,P=s.P,dt=Math.min(.05,g-s.last);s.last=g;if(dt<=0)return;
 if(s.hs>0){s.hs-=dt;return}
 const bat=g>=8.5&&g<13.5,bs=g>=13.5;
 s.o+=dt*(bat?1.5:bs?.75:.95);
 const nx=CX+Math.cos(s.o)*440,ny=CY+Math.sin(s.o)*260,vx=(nx-P.x)/dt,vy=(ny-P.y)/dt;P.x=nx;P.y=ny;
 s.cam.x+=(P.x+vx*.25-s.cam.x)*Math.min(1,dt*5);s.cam.y+=(P.y+vy*.25-s.cam.y)*Math.min(1,dt*5);
 s.sp-=dt;const al=s.en.filter(e=>!e.d).length;
 if(g<13.5&&s.sp<=0&&al<(bat?9:7)){s.sp=bat?.38:.5;const a=s.r()*6.28;s.en.push({x:Math.max(30,Math.min(WW-30,P.x+Math.cos(a)*780)),y:Math.max(30,Math.min(WH-30,P.y+Math.sin(a)*600)),d:0,t:.3+s.r()*.8,o:s.r()>.5?1:-1})}
 if(bs&&!s.boss)s.boss={x:Math.min(WW-60,P.x+720),y:P.y,d:0};
 if(s.boss&&!s.boss.d&&g>=16.1){s.boss.d=1;snd('death',.9);s.shake=1;s.hs=.15;burst(s,s.boss.x,s.boss.y,50);hit(1.5,1,.9,1.5)}
 const B=s.boss;
 if(B&&!B.d){const dx=P.x-B.x,dy=P.y-B.y,d=Math.hypot(dx,dy)||1;if(d>380){B.x+=dx/d*170*dt;B.y+=dy/d*170*dt}else{B.x+=-dy/d*70*dt;B.y+=dx/d*70*dt}
  s.bt-=dt;if(s.bt<=0&&d<700){s.bt=1.1;snd('shotgun',.8);s.shake=.4;const b=Math.atan2(dy,dx);for(let i=0;i<7;i++){const a=b+(i/6-.5)*.5;s.eb.push({x:B.x,y:B.y,vx:Math.cos(a)*(560+i*12),vy:Math.sin(a)*(560+i*12),l:1})}}}
 let T=null,best=1e9;
 for(const e of s.en)if(!e.d){const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<best){best=d;T=e}}
 if(B&&!B.d){T=B;best=Math.hypot(B.x-P.x,B.y-P.y)}
 if(T)s.a+=wrap(Math.atan2(T.y-P.y,T.x-P.x)-s.a)*Math.min(1,dt*16);
 for(const e of s.en){if(e.d)continue;const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
  if(d>(bat?55:250)){const v=bat?270:175;e.x+=ux*v*dt;e.y+=uy*v*dt}else if(!bat){e.x+=-uy*e.o*110*dt;e.y+=ux*e.o*110*dt}
  e.t-=dt;if(!bat&&e.t<=0&&d<760&&d>150){const a=Math.atan2(dy,dx)+(s.r()-.5)*.6;s.eb.push({x:e.x,y:e.y,vx:Math.cos(a)*650,vy:Math.sin(a)*650,l:1.4});e.t=.8+s.r()*.8}}
 s.cd-=dt;
 if(!bat&&T&&s.cd<=0&&Math.abs(wrap(Math.atan2(T.y-P.y,T.x-P.x)-s.a))<.12){s.bl.push({x:P.x+Math.cos(s.a)*60,y:P.y+Math.sin(s.a)*60,vx:Math.cos(s.a)*1500,vy:Math.sin(s.a)*1500,l:1.1});snd('pistol',.55);s.cd=B?.26:.2;s.mf=.08;s.zm=.5;s.shake=Math.max(s.shake,.12)}
 if(bat&&T&&best<150&&s.sw>=.45){s.sw=0;s.hit=false;snd('bat',.8);s.zm=.6}
 if(s.sw<.9)s.sw+=dt;
 if(!s.hit&&s.sw>.2){s.hit=true;let k=0;for(const e of s.en)if(!e.d&&Math.hypot(e.x-P.x,e.y-P.y)<170){e.d=1;k++;burst(s,e.x,e.y,16)}if(k){snd('death',.5);s.shake=.6;s.hs=.06;hit(.9,.5,.3,.8)}}
 for(const b of s.bl){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;
  for(const e of s.en)if(!e.d&&Math.hypot(e.x-b.x,e.y-b.y)<42){e.d=1;b.l=0;snd('death',.4);burst(s,e.x,e.y,12);s.shake=Math.max(s.shake,.25);s.hs=.03;break}
  if(B&&!B.d&&Math.hypot(B.x-b.x,B.y-b.y)<80){b.l=0;burst(s,B.x,B.y,3)}}
 for(const b of s.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(Math.hypot(b.x-P.x,b.y-P.y)<38){b.l=0;s.shake=Math.max(s.shake,.3);burst(s,P.x,P.y,5)}}
 for(const p of s.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.95;p.vy*=.95;p.l-=dt}
 s.pt=s.pt.filter(p=>p.l>0);s.bl=s.bl.filter(b=>b.l>0);s.eb=s.eb.filter(b=>b.l>0);
 s.shake=Math.max(0,s.shake-dt);s.zm=Math.max(0,s.zm-dt*4);s.mf=Math.max(0,s.mf-dt)}
function drawG(g){
 const s=G,P=s.P,c=s.cam,bat=g>=8.5&&g<13.5;
 if(!pat){const q=document.createElement('canvas');q.width=q.height=128;q.getContext('2d').drawImage(I.fl,0,0,128,128);pat=x.createPattern(q,'repeat')}
 x.save();{const z=.88+.06*s.zm+(bat?.05:0);x.translate(W/2,H/2);x.scale(z,z)}
 if(s.shake>0)x.translate((Math.random()-.5)*28*s.shake,(Math.random()-.5)*28*s.shake);
 x.translate(-c.x,-c.y);
 x.fillStyle=pat;x.fillRect(0,0,WW,WH);
 TB.forEach(t=>spr('tb',t[0],t[1],t[2],150));
 for(const e of s.en)if(e.d)spr('ed',e.x,e.y,Math.atan2(P.y-e.y,P.x-e.x),96);
 if(s.boss&&s.boss.d)spr('bd',s.boss.x,s.boss.y,Math.PI,170);
 for(const e of s.en)if(!e.d)spr('en',e.x,e.y,Math.atan2(P.y-e.y,P.x-e.x),96);
 if(s.boss&&!s.boss.d)spr('bo',s.boss.x,s.boss.y,Math.atan2(P.y-s.boss.y,P.x-s.boss.x)+Math.PI,170);
 if(bat){const f=s.sw<.45?1+Math.min(8,Math.floor(s.sw/.05)):0;spr('b'+(f+1),P.x,P.y,s.a-.785,110)}else spr('pl',P.x,P.y,s.a,110);
 for(const p of s.pt){x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s)}
 if(s.mf>0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(P.x+Math.cos(s.a)*88,P.y+Math.sin(s.a)*88,22*s.mf/.08,0,7);x.fill()}
 x.fillStyle='#ffdc64';for(const b of s.bl){x.save();x.translate(b.x,b.y);x.rotate(Math.atan2(b.vy,b.vx));x.fillRect(-34,-1.5,34,3);x.restore()}
 x.fillStyle='#ff5050';for(const b of s.eb){x.save();x.translate(b.x,b.y);x.rotate(Math.atan2(b.vy,b.vx));x.fillRect(-24,-1.5,24,3);x.restore()}
 x.restore();
 const v=x.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(20,0,10,.7)');x.fillStyle=v;x.fillRect(0,0,W,H);
 x.save();x.font='22px G,Georgia,serif';x.textBaseline='top';x.textAlign='left';x.fillStyle='rgba(255,255,255,.8)';x.fillText('WAVE '+Math.min(5,1+(g/3.4|0))+' / 5',22,18);
 x.textAlign='right';x.fillStyle=bat?'#fff':'rgba(255,255,255,.35)';x.fillText('BAT',W-150,H-44);x.fillStyle=bat?'rgba(255,255,255,.35)':'#fff';x.fillText('PISTOL',W-22,H-44);x.restore()}
/* ---------- timeline ---------- */
const sc=(n,a,b,fit)=>({a,b,f:(p)=>pic(n,p,b-a,fit)});
const SEG=[sc('s1',0,3.5),sc('s3',3.5,6),sc('s5',6,9.5),sc('s7',9.5,13),sc('s10',13,15.5),
 {a:16.5,b:33,g:1},
 sc('k2',33,34.8,1),sc('p2',34.8,36.6,1),sc('p3',36.6,38.8,1),sc('p4',38.8,40.5,1),
 {a:43,b:D,f:(p)=>pic('menu',p,12,0,1,1.06)}];
const CAP=[[15.5,16.6,'ONE CALL.'],[17,21,'SHOOT.'],[25.2,29,'SWING.'],[30.3,33,'PAY UP.'],[33,34.8,'KILL HIM.','#ff2d7a'],[34.8,36.6,'OR HEAR HIM OUT.','#ffe6a8'],[40.6,42.9,'SOMEONE WANTS YOU BOTH DEAD.','#ff2d7a'],[46,D,'PRE ORDER ON STEAM FOR 3$','#fff']];
function cap(t,a,b,s,c='#fff'){const p=t-a,q=Math.min(1,p/.14),sz=(b-a>5?64:92)*(1.3-.3*q);x.save();x.globalAlpha=Math.min(q,Math.min(1,(b-t)/.25));x.font=sz+'px G,Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=10;x.lineJoin='round';x.strokeStyle='#000';
 const end=s.startsWith('PRE'),y=end?H*.84:H*.84;if(end){x.shadowColor='#ff2d7a';x.shadowBlur=24+12*Math.sin(t*5);x.font=(58*(1.3-.3*q))+'px G,Georgia,serif'}
 x.strokeText(s,W/2,y);x.fillStyle=c;x.fillText(s,W/2,y);x.restore()}
let fired={};
function frame(){
 const t=ac.currentTime-base,dt=Math.max(0,Math.min(.1,t-lt));lt=t;x.fillStyle='#000';x.fillRect(0,0,W,H);
 SEG.forEach((s,i)=>{if(t>=s.a&&t<s.a+.5&&!seen[i]){seen[i]=1;if(i==6){hit(1.4,1,.7,1.3);snd('pistol',1)}else if(i==10)hit(1,.9,.5,1.4);else if(i==5)hit(.6,.6,.4,1);else if(i>0)hit(.55,.4,.35,.8)}});
 CAP.forEach((c,i)=>{if(t>=c[0]&&t<c[0]+.5&&!seen['c'+i]){seen['c'+i]=1;hit(.45,.15,.15,.5)}});
 for(const s of SEG)if(t>=s.a&&t<s.b){const p=t-s.a;if(s.g){if(p<.05)resetG();stepG(p);drawG(p)}else s.f(p);
  if(p<.07){x.fillStyle='rgba(0,0,0,'+(1-p/.07)+')';x.fillRect(0,0,W,H)}}
 if(t>=43&&t<D){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H)}
 if(t>=40.5&&t<42.9){}
 for(const c of CAP)if(t>=c[0]&&t<c[1])cap(t,c[0],c[1],c[2],c[3]);
 post(dt);
 if(t<D+1)requestAnimationFrame(frame);else{run=false;m.textContent='click to replay';o.style.display='grid'}}
