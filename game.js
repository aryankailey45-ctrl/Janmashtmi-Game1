/* Makhan Run - original Janmashtami themed 3D runner. */
(() => {
  const canvas = document.querySelector('#game');
  // Mobile-first settings: no expensive real-time shadows/lights and a capped render density.
  const renderer = new THREE.WebGLRenderer({canvas, antialias:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25)); renderer.shadowMap.enabled = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x120b2d); scene.fog = new THREE.Fog(0x3a1b62, 19, 105);
  const camera = new THREE.PerspectiveCamera(58, 1, .1, 180); camera.position.set(0,5.3,10.5);
  const hemi = new THREE.HemisphereLight(0xf9ccff,0x26114e,2.2); scene.add(hemi);
  const moon = new THREE.DirectionalLight(0xffd9a0,2.2); moon.position.set(-7,14,6); scene.add(moon);
  const scoreEl = document.querySelector('#score'), flowerEl = document.querySelector('#flowers');
  const start = document.querySelector('#start'), over = document.querySelector('#over');
  const lanes = [-3.1,0,3.1], clock = new THREE.Clock(); let running=false, lane=1, y=0, vy=0, score=0, flowers=0, speed=.44, spawn=0, last=0, objects=[];
  const mat=(color,rough=.75)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:.05});
  const box=(w,h,d,color)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));
  // Track and background
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(28,210),mat(0x472057)); ground.rotation.x=-Math.PI/2;ground.position.z=-78;scene.add(ground);
  for(let x of lanes){ const stripe = new THREE.Mesh(new THREE.BoxGeometry(.09,.025,208),mat(0xffcc72));stripe.position.set(x-1.55,.025,-78);scene.add(stripe) }
  const moonDisc=new THREE.Mesh(new THREE.SphereGeometry(5,24,18),mat(0xffedb0));moonDisc.position.set(-15,16,-70);scene.add(moonDisc);
  for(let i=0;i<28;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.05,5,5),mat(0xffefb9));s.position.set((Math.random()-.5)*42,5+Math.random()*24,-25-Math.random()*125);scene.add(s)}
  function temple(z,side){const g=new THREE.Group();const x=side*11; let base=box(5,3,3,side<0?0xa44661:0x5a498c);base.position.y=1.5;g.add(base);let dome=new THREE.Mesh(new THREE.ConeGeometry(2.5,3.5,6),mat(0xf3b75b));dome.position.y=4.7;g.add(dome);for(let i=-1;i<=1;i++){let orb=new THREE.Mesh(new THREE.SphereGeometry(.16,6,6),new THREE.MeshBasicMaterial({color:0xffc85c}));orb.position.set(i*1.35,3,1.65);g.add(orb)}g.position.set(x,0,z);scene.add(g)}
  // Festive flower garlands, oil lamps, and hanging earthen pots line the path.
  function garland(z){const g=new THREE.Group();for(let i=0;i<11;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),mat(i%2?0xffb02e:0xf4d24d));f.position.set(-8+i*1.6,7+Math.sin(i*.7)*.35,0);g.add(f)}const rope=box(17,.05,.05,0x48a05c);rope.position.set(0,7,0);g.add(rope);g.position.z=z;scene.add(g)}
  function diya(z, side){const g=new THREE.Group();const cup=new THREE.Mesh(new THREE.CylinderGeometry(.24,.36,.14,8),mat(0xd67a37));cup.position.y=.18;g.add(cup);const fire=new THREE.Mesh(new THREE.SphereGeometry(.13,6,6),new THREE.MeshBasicMaterial({color:0xffe16b}));fire.scale.y=1.8;fire.position.y=.53;g.add(fire);g.position.set(side*6.4,0,z);scene.add(g)}
  for(let z=-10;z>-130;z-=21){temple(z,-1);temple(z-10,1);garland(z-5);diya(z,-1);diya(z,1);diya(z-9,-1);diya(z-9,1)}
  // Village edge: shaded mango trees make the route feel deeper and more natural.
  function tree(z,side){const g=new THREE.Group(),trunk=box(.48,3,.48,0x6d3b25);trunk.position.y=1.5;g.add(trunk);for(let i=0;i<4;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1.3,12,10),mat(i%2?0x29683c:0x3d8748));leaf.position.set((i%2-.5)*1.05,3.15+Math.floor(i/2)*.78,(i%3-.5)*.7);leaf.castShadow=true;g.add(leaf)}g.position.set(side*9.2,0,z);scene.add(g)}
  for(let z=-22;z>-130;z-=35){tree(z,-1);tree(z-11,1)}
  // Animated, stylised Krishna runner: blue skin, yellow dhoti, crown, flute and peacock feather.
  const hero=new THREE.Group();
  const blue=mat(0x277dc5), yellow=mat(0xf2bd38), gold=mat(0xf3cf63), brown=mat(0x7b4b31);
  const torso=box(.9,1.05,.52,blue);torso.position.y=2.03;hero.add(torso);
  const dhoti=new THREE.Mesh(new THREE.ConeGeometry(.69,1.05,5),yellow);dhoti.scale.z=.65;dhoti.position.y=1.32;dhoti.castShadow=true;hero.add(dhoti);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.53,12,10),blue);head.position.y=3.02;hero.add(head);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.56,18,14),brown);hair.scale.set(1,.36,1.02);hair.position.y=3.32;hero.add(hair);
  const crown=new THREE.Mesh(new THREE.ConeGeometry(.54,.56,5),gold);crown.position.y=3.57;crown.rotation.y=.62;hero.add(crown);
  const feather=new THREE.Group();const plume=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),mat(0x21ad84));plume.scale.set(.55,2.45,.7);plume.position.y=.22;feather.add(plume);const eye=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),mat(0x165bb2));eye.position.set(0,.45,.12);feather.add(eye);feather.position.set(.29,3.89,0);feather.rotation.z=-.25;hero.add(feather);
  const flute=box(1.45,.08,.08,0xe7bb4d);flute.position.set(.48,2.35,.4);flute.rotation.z=-.18;hero.add(flute);
  const limbs=[];function limb(x,y,angle,leg=false){const p=new THREE.Group();const l=box(.22,leg?.93:.72,.22,blue);l.position.y=-(leg?.46:.35);p.add(l);if(leg){const foot=box(.28,.16,.42,blue);foot.position.set(0,-.94,.11);p.add(foot)}p.position.set(x,y,.02);p.rotation.z=angle;hero.add(p);limbs.push({p,leg,base:angle});}
  limb(-.52,2.37,.55);limb(.52,2.37,-.55);limb(-.32,1.1,.18,true);limb(.32,1.1,-.18,true);
  // Keep Krishna comfortably in frame on narrow phone screens.
  hero.position.set(0,0,0);scene.add(hero);
  // A lightweight generated flute + tabla loop; starts only after the user taps Start.
  let musicContext=null,musicTimer=null,musicStep=0;
  function note(ctx,freq,at,len,volume,type='triangle'){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(volume,at+.025);g.gain.exponentialRampToValueAtTime(.0001,at+len);o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+len+.03)}
  function beat(ctx,at,high=false){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(high?190:105,at);o.frequency.exponentialRampToValueAtTime(45,at+.16);g.gain.setValueAtTime(.09,at);g.gain.exponentialRampToValueAtTime(.0001,at+.18);o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+.2)}
  function startMusic(){try{if(musicTimer)return;const AC=window.AudioContext||window.webkitAudioContext;musicContext=new AC();const melody=[523,587,659,587,698,659,587,523,440,523,587,659,698,659,587,523];const playBar=()=>{if(!musicContext)return;const now=musicContext.currentTime+.05;for(let i=0;i<4;i++){const n=melody[(musicStep+i)%melody.length];note(musicContext,n,now+i*.34,.28,.026);beat(musicContext,now+i*.34,i%2===1)}musicStep=(musicStep+4)%melody.length};playBar();musicTimer=setInterval(playBar,1360)}catch(e){}}
  function sound(freq, duration=.08, type='sine', vol=.04){ try { const AC=window.AudioContext||window.webkitAudioContext; const a=new AC(),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+duration);}catch(e){} }
  function makeObstacle(){const g=new THREE.Group(), kind=Math.random();if(kind<.35){let cart=box(2.15,1.12,1.18,0x925037);cart.position.y=.68;g.add(cart);let rail=box(2.28,.15,.16,0xe0a348);rail.position.set(0,1.32,.52);g.add(rail);for(let x of [-.78,.78]){let w=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.2,14),mat(0x352335));w.rotation.z=Math.PI/2;w.position.set(x,.43,.58);g.add(w);let hub=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.22,10),mat(0xf0b64d));hub.rotation.z=Math.PI/2;hub.position.set(x,.43,.7);g.add(hub)}}else if(kind<.7){let hurdle=box(2.3,.18,.18,0xe5a849);hurdle.position.y=.7;g.add(hurdle);for(let x of [-.9,.9]){let p=box(.18,1.2,.18,0x8a512e);p.position.set(x,.6,0);g.add(p);let flower=new THREE.Mesh(new THREE.SphereGeometry(.19,8,8),mat(0xf14b61));flower.position.set(x,1.24,0);g.add(flower)}}else{let crate=box(1.8,1.65,.8,0x75412e);crate.position.y=.83;g.add(crate);for(let a of [-.72,.72]){let brace=box(.12,1.72,.1,0xd2914d);brace.position.set(a,.84,.46);brace.rotation.z=a*.3;g.add(brace)}let pot=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),mat(0xd8783a));pot.scale.y=.75;pot.position.y=1.82;g.add(pot)}g.userData={type:'bad'};return g}
  function makeButter(){const g=new THREE.Group(),pot=new THREE.Mesh(new THREE.CylinderGeometry(.38,.48,.54,14),mat(0xef9d5a));pot.position.y=.35;g.add(pot);let cream=new THREE.Mesh(new THREE.SphereGeometry(.36,13,10),mat(0xfff1c3));cream.scale.y=.45;cream.position.y=.67;g.add(cream);g.userData={type:'good',spin:Math.random()*6};return g}
  function create(){ const g=Math.random()<.36?makeObstacle():makeButter();g.position.set(lanes[Math.floor(Math.random()*3)],0,-72);scene.add(g);objects.push(g) }
  function end(){running=false; document.querySelector('#final-score').textContent=`You gathered ${Math.floor(score)} makhan and ${flowers} lotus flowers.`;over.classList.remove('hidden');sound(100,.25,'sawtooth',.05)}
  function reset(){objects.forEach(o=>scene.remove(o));objects=[];lane=1;y=vy=score=flowers=spawn=0;speed=.44;hero.position.set(0,0,0);camera.position.x=0;scoreEl.textContent=0;flowerEl.textContent=0;over.classList.add('hidden');start.classList.add('hidden');running=true;clock.getDelta();startMusic();sound(523,.1,'sine',.04)}
  function move(dir){if(!running)return;lane=Math.max(0,Math.min(2,lane+dir));sound(350,.045,'triangle',.018)} function jump(){if(running&&y<.02){vy=.245;sound(700,.08,'sine',.04)}}
  document.querySelector('#play').onclick=reset;document.querySelector('#again').onclick=reset;
  addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);if(e.key===' '||e.key==='ArrowUp')jump()});
  let sx=0,sy=0;canvas.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY; if(!running&&start.classList.contains('hidden')===false)reset()});canvas.addEventListener('pointerup',e=>{let dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else if(dy<-28)jump()});
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
  let previousRender=0;
  function tick(t){requestAnimationFrame(tick);if(t-previousRender<22)return;previousRender=t;const d=Math.min(clock.getDelta()*60,2);if(running){speed+=.000018*d;spawn+=d; if(spawn>Math.max(32,75-speed*80)){create();spawn=0}hero.position.x+=(lanes[lane]-hero.position.x)*.16*d;vy-=.012*d;y+=vy*d;if(y<0){y=0;vy=0}hero.position.y=y;hero.rotation.z=(lanes[lane]-hero.position.x)*-.07;hero.rotation.x=Math.sin(t*.015)*.04;const stride=Math.sin(t*.021)*.72;limbs.forEach((l,i)=>{l.p.rotation.z=l.base+(l.leg?(i===2?stride:-stride):0)});objects.forEach((o,i)=>{o.position.z+=speed*d;o.rotation.y+=o.userData.type==='good'?.06*d:0;if(o.position.z>8){scene.remove(o);objects.splice(i,1);return}if(Math.abs(o.position.z)<1.05&&Math.abs(o.position.x-hero.position.x)<1.15){if(o.userData.type==='bad'&&y<.75)end();if(o.userData.type==='good'){score++;flowers+=score%5===0?1:0;scoreEl.textContent=score;flowerEl.textContent=flowers;sound(880,.09,'sine',.045);scene.remove(o);objects.splice(i,1)}}});camera.position.x+=(hero.position.x-camera.position.x)*.20*d;score+=.015*d;scoreEl.textContent=Math.floor(score)}renderer.render(scene,camera)}requestAnimationFrame(tick);
})();
