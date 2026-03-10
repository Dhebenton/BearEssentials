const CONFIG = {
  scaleFrom:        1.8,
  scaleTo:          1,
  staggerMs:        399,
  transition:       'transform 0.52s cubic-bezier(0.22, 1.2, 0.36, 1), opacity 0.33s ease-out',
  expandDelay:      680,
  expandTransition: 'transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94), margin-top 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  base: [
    { deg: 3,    x:  4,  y:  -8 },
    { deg: -5,   x: -10, y:   6 },
    { deg: 4.5,  x:  8,  y:   3 },
    { deg: -3.5, x: -6,  y: -10 },
    { deg: 6,    x:  5,  y:   8 },
  ],
};

const polaroids     = [...document.querySelectorAll('.ls-polaroid-photo-wrap')];
const loadingScreen = document.querySelector('.loading-screen');
const video         = document.querySelector('main video');

polaroids.forEach((p, i) => {
  const b = CONFIG.base[i];
  if (!b) return;
  p.style.cssText = `transition:none;opacity:0;transform:rotate(${b.deg * 2.5}deg) translate(${b.x * 2.5}px,${b.y * 2.5}px) scale(${CONFIG.scaleFrom})`;
});

document.body.offsetHeight;

polaroids.forEach((p, i) => {
  const b = CONFIG.base[i];
  if (!b) return;
  setTimeout(() => {
    p.style.transition = CONFIG.transition;
    p.style.opacity    = '1';
    p.style.transform  = `rotate(${b.deg}deg) translate(${b.x}px,${b.y}px) scale(${CONFIG.scaleTo})`;
  }, CONFIG.staggerMs * (i + 1));
});

setTimeout(() => {
  const five      = polaroids.find(p => p.classList.contains('five'));
  if (!five) return;
  const img       = five.querySelector('img');
  const caption   = five.querySelector('.ls-polaroid-photo-background');
const waveLS       = document.querySelector('.loading-screen .hero-waves');
  const waveMain     = document.querySelector('main .hero-waves');
  const backgroundBlur = document.querySelector('.background-blur');

  // Set loading screen background and fade caption immediately as expand starts
  loadingScreen.style.backgroundColor = '#FDFAF7';
  caption.style.transition            = 'all 0.2s ease';
  caption.style.opacity               = '0';

  five.style.transition = CONFIG.expandTransition;
  five.style.transform  = 'rotate(0deg) translate(0,0) scale(1)';
  five.style.width      = '100%';
  five.style.height     = '95vh';
  five.style.marginTop  = '-5vh';

  img.style.transition  = CONFIG.expandTransition;
  img.style.width       = '100%';
  img.style.height      = '100%';

  // 3/4 through the expand transition
  setTimeout(() => {
    [waveLS, waveMain].forEach(wave => {
      if (!wave) return;
      wave.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      wave.style.transform  = 'translateY(0%)';
    });
    if (backgroundBlur) {
      backgroundBlur.style.transition = 'opacity 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      backgroundBlur.style.opacity    = '1';
    }
  }, Math.round(.4 * 750));


  setTimeout(() => {
    loadingScreen.style.transition = 'all 0.3s ease-in';
    loadingScreen.style.opacity    = '0';
    video.style.width              = '100%';
    video.style.height             = '95vh';
    video.playbackRate             = 1.5;
    video.play();
  }, 750);

}, CONFIG.staggerMs * polaroids.length + CONFIG.expandDelay);