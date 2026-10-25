
/*
 * Glyphfever — Phase 2
 * Continuous, responsive ambient particles
 */

const hero = document.querySelector(".hero");
const svg = d3.select(".particle-layer");

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);


 // --------------------------------------
 // Phase 3A.1: Pointer tracking
 // --------------------------------------

 const pointer = {
   x: 0,
   y: 0,
   active: false
 };

 d3.select(hero)
   .on("pointermove", function(event) {
     const [x, y] = d3.pointer(event, this);

     pointer.x = x;
     pointer.y = y;
     pointer.active = true;
     
   })
   .on("pointerleave", function() {
     pointer.active = false;
   });



let width = hero.clientWidth;
let height = hero.clientHeight;

svg.attr("viewBox", `0 0 ${width} ${height}`);

// --------------------------------------
// 1. Particle data: position and velocity
// --------------------------------------

const particleCount = 14;

const particles = d3.range(particleCount).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: Math.random() * 2 + 1.5,
  color: Math.random() > 0.5 ? "#87B9FF" : "#F2C96D",
  vx: (Math.random() - 0.5) * 4,
  vy: -(6 + Math.random() * 8) // gentle speed 6 -14 px/sec
}));

// Bind particle data to SVG circles
const circles = svg
  .selectAll("circle")
  .data(particles)
  .join("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.r)
  .attr("fill", d => d.color)
  .attr("opacity", 0.5);

// --------------------------------------
// 2. Animation: d3.timer()
// --------------------------------------

let timer = null;
let heroIsVisible = false;

function startAnimation() {
  // Avoid starting a second timer
  if (timer !== null) return;

  let previousElapsed = 0;

  timer = d3.timer((elapsed) => {
    const dt = Math.min(
      (elapsed - previousElapsed) / 1000,
      0.05
    );

    previousElapsed = elapsed;

    particles.forEach(d => {
      // Phase 3A.2: Detect particles near the pointer
      const repulsionRadius = 90;
    
      if (pointer.active) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const distance = Math.hypot(dx, dy);
    
        // Temporary visual feedback
        d.nearPointer = distance < repulsionRadius;
      } else {
        d.nearPointer = false;
      }
    
      // Existing position updates
      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // Vertical wrapping
      if (d.y < -d.r) {
        d.y = height + d.r;
        d.x = Math.random() * width;
      }

      // Horizontal wrapping
      if (d.x < -d.r) {
        d.x = width + d.r;
      } else if (d.x > width + d.r) {
        d.x = -d.r;
      }
    });

    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("opacity", d => d.nearPointer ? 1 : 0.5);
  });
}

function stopAnimation() {
  if (timer !== null) {
    timer.stop();
    timer = null;
  }
}

// --------------------------------------
// 3. Central animation control
// --------------------------------------

function updateAnimationState() {
  const shouldAnimate =
    heroIsVisible &&
    !document.hidden &&
    !motionPreference.matches;

  if (shouldAnimate) {
    startAnimation();
  } else {
    stopAnimation();
  }
}

// --------------------------------------
// 4. Responsive sizing
// --------------------------------------

const resizeObserver = new ResizeObserver(() => {
  const oldWidth = width;
  const oldHeight = height;

  width = hero.clientWidth;
  height = hero.clientHeight;

  if (width <= 0 || height <= 0) return;

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  particles.forEach(d => {
    d.x *= width / (oldWidth || width);
    d.y *= height / (oldHeight || height);
  });

  circles
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
});

resizeObserver.observe(hero);

// --------------------------------------
// 5. Pause when hero is out of view
// --------------------------------------

const visibilityObserver = new IntersectionObserver(
  entries => {
    heroIsVisible = entries[0].isIntersecting;
    updateAnimationState();
  },
  { threshold: 0 }
);

visibilityObserver.observe(hero);

// --------------------------------------
// 6. Browser tab and accessibility
// --------------------------------------

// Pause when switching to another tab
document.addEventListener(
  "visibilitychange",
  updateAnimationState
);

// React to changes in reduced-motion settings
motionPreference.addEventListener(
  "change",
  updateAnimationState
);
