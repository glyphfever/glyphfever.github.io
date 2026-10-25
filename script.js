
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (!reducedMotion.matches) {
  const hero = document.querySelector(".hero");
  const svg = d3.select(".particle-layer");

  let width = hero.clientWidth;
  let height = hero.clientHeight;

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const particleCount = 14;

  // 1. Generate particle data with velocity
  const particles = d3.range(particleCount).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1.5,
    color: Math.random() > 0.5 ? "#87B9FF" : "#F2C96D",
    vx: (Math.random() - 0.5) * 4,
    vy: -(6 + Math.random() * 8) // gentle speed 6 - 14 px/sec
  }));

  // 2. Bind particles to SVG circles
  const circles = svg
    .selectAll("circle")
    .data(particles)
    .join("circle")
    .attr("r", d => d.r)
    .attr("fill", d => d.color)
    .attr("opacity", 0.5);

  // 3. Create one continuous animation timer
  let previousElapsed = 0;

  d3.timer((elapsed) => {
    const dt = Math.min(
      (elapsed - previousElapsed) / 1000,
      0.05
    );

    previousElapsed = elapsed;

    particles.forEach(d => {
      // Update positions using velocity
      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // Recycle at the top boundary
      if (d.y < -d.r) {
        d.y = height + d.r;
        d.x = Math.random() * width;
      }

      // Wrap around horizontal boundaries
      if (d.x < -d.r) {
        d.x = width + d.r;
      } else if (d.x > width + d.r) {
        d.x = -d.r;
      }
    });

    // Update SVG attributes
    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });
}
