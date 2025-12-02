// Simple Birthday Wish page that reads URL param "name" and shows a message.
// Also lets user generate a shareable link using input.
(function(){
  // helpers
  function getParam(name){
    const u = new URL(window.location.href);
    return u.searchParams.get(name) || '';
  }
  function setText(id, txt){ const el = document.getElementById(id); if(el) el.textContent = txt; }

  // personalization
  const name = decodeURIComponent(getParam('name') || '').trim();
  const age = decodeURIComponent(getParam('age') || '').trim();
  const theme = decodeURIComponent(getParam('theme') || '').trim();

  if(name){
    setText('greeting', Happy Birthday, ${name}! 🎂);
    let msg = Wishing you love, joy and lots of cake today.;
    if(age) msg += ` Turning ${age} — enjoy every moment!`;
    setText('message', msg);
    setText('meta', Sent via GitHub Pages • Theme: ${theme || 'classic'});
  } else {
    setText('greeting', 'Happy Birthday!');
    setText('message', 'Use the box below to create a personalized link.');
    setText('meta', '');
  }

  // share link builder
  const nameInput = document.getElementById('nameInput');
  const makeLinkBtn = document.getElementById('makeLink');
  const shareLinkInput = document.getElementById('shareLink');

  makeLinkBtn.addEventListener('click', ()=>{
    const nm = nameInput.value.trim();
    if(!nm){ alert('Type a name first'); return; }
    const base = ${location.origin}${location.pathname};
    const params = new URLSearchParams({ name: nm });
    const share = ${base}?${params.toString()};
    shareLinkInput.value = share;
    shareLinkInput.select();
    try { document.execCommand('copy'); } catch(e){}
    alert('Link copied to clipboard (if allowed). Share it!');
  });

  // confetti (simple particle burst)
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function makeConfetti(x,y){
    for(let i=0;i<90;i++){
      particles.push({
        x: x || rand(0,canvas.width),
        y: y || rand(0,canvas.height/2),
        vx: rand(-6,6), vy: rand(-10,2),
        size: rand(6,12),
        life: rand(60,120),
        color: ['#ff5e5e','#ffd56b','#6ad6ff','#9d8bff','#6fff88'][Math.floor(rand(0,5))]
      });
    }
  }

  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.life--;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x,p.y,p.size, p.size*0.6);
      if(p.life<=0 || p.y>canvas.height+50) particles.splice(i,1);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // trigger confetti button
  document.getElementById('playConfetti').addEventListener('click', ()=>{
    makeConfetti(window.innerWidth/2, window.innerHeight/3);
  });

  // if there is a name, automatically show a small burst
  if(name) setTimeout(()=>makeConfetti(window.innerWidth/2, window.innerHeight/3), 600);
})();
