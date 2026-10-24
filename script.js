const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  const hero = document.querySelector(".hero");
  const svg = d3.select(".particle-layer");

  const heroRect = hero.getBoundingClientRect();
  const width = heroRect.width;
  const height = heroRect.height;

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "none");

  const particleCount = 14;

  const particles = d3.range(particleCount).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1.5,
    color: Math.random() > 0.5 ? "#87B9FF" : "#F2C96D",
    duration: 6000 + Math.random() * 4000,
    drift: (Math.random() - 0.5) * 20
  }));

  const circles = svg
    .selectAll("circle")
    .data(particles)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", d => d.color)
    .attr("opacity", 0.18);

  function animateParticle(selection, d) {
    selection
      .transition()
      .duration(d.duration)
      .ease(d3.easeLinear)
      .attr("cx", d.x + d.drift)
      .attr("cy", d.y - 40)
      .attr("opacity", 0.05)
      .on("end", function () {
        d.x = Math.random() * width;
        d.y = height + Math.random() * 30;
        d.drift = (Math.random() - 0.5) * 20;

        d3.select(this)
          .attr("cx", d.x)
          .attr("cy", d.y)
          .attr("opacity", 0.18);

        animateParticle(d3.select(this), d);
      });
  }

  circles.each(function (d) {
    animateParticle(d3.select(this), d);
  });
}
