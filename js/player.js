/* Неоновий плеєр поверх <video id="v"> */
(()=>{
const g=id=>document.getElementById(id),v=g('v'),o=g('o'),m=g('m'),PB=g('pp'),SK=g('sk'),TM=g('tm'),MT=g('mt'),FS=g('fs'),PL=g('pl');
if(!v)return;
let drag=false;
const fmt=s=>{s=Math.max(0,s|0);return(s/60|0)+':'+String(s%60).padStart(2,'0')};
const dur=()=>isFinite(v.duration)&&v.duration>0?v.duration:55;
function ui(){
 const d=dur(),t=drag?+SK.value:v.currentTime;
 PB.textContent=v.paused?'▶':'❚❚';PB.setAttribute('aria-label',v.paused?'Play':'Pause');
 SK.max=d;if(!drag)SK.value=v.currentTime;
 SK.style.setProperty('--p',(100*t/d)+'%');
 TM.textContent=fmt(t)+' / '+fmt(d);
 MT.classList.toggle('off',v.muted||v.volume===0);
}
const toggle=()=>{if(v.ended)v.currentTime=0;v.paused||v.ended?v.play():v.pause()};
PB.onclick=toggle;v.onclick=toggle;
o.onclick=()=>{o.style.display='none';if(v.ended)v.currentTime=0;v.play()};
o.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.click()}});
v.addEventListener('play',()=>{o.style.display='none';ui()});
v.addEventListener('pause',ui);
v.addEventListener('timeupdate',ui);
v.addEventListener('loadedmetadata',ui);
v.addEventListener('ended',()=>{m.textContent='press to replay';o.style.display='grid';ui()});
SK.oninput=()=>{drag=true;ui()};
SK.onchange=()=>{v.currentTime=+SK.value;drag=false;ui()};
MT.onclick=()=>{v.muted=!v.muted;ui()};
v.addEventListener('volumechange',ui);
document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause()});
const rf=PL.requestFullscreen||PL.webkitRequestFullscreen,fe=()=>document.fullscreenElement||document.webkitFullscreenElement;
if(!rf&&!v.webkitEnterFullscreen)FS.hidden=true;
FS.onclick=()=>{if(fe())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else if(rf)rf.call(PL);else v.webkitEnterFullscreen()};
ui();
})();
