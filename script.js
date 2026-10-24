const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  const hero = document.querySelector(".hero");
  const svg = d3.select(".particle-layer");
  
  // measure the area 
  const heroRect = hero.getBoundingClientRect();
  const width = heroRect.width;
  const height = heroRect.height;
  
  // set coordinate system; fill the entire svg container 
  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "none");

  // generate an array of particle objects
  const particleCount = 14;
  const particles = d3.range(particleCount).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1.5,
    color: Math.random() > 0.5 ? "#87B9FF" : "#F2C96D",
    duration: 6000 + Math.random() * 4000, // how long it drifts
    drift: (Math.random() - 0.5) * 20
  }));

  // connect particle data to circles
  const circles = svg
    .selectAll("circle")
    .data(particles)
    .join("circle") // create one circle for each particle object d
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", d => d.color)
    .attr("opacity", 0.18);

  // this function handles one particle at a time
  function animateParticle(selection, d) {
    selection
      .transition()
      .duration(d.duration)
      .ease(d3.easeLinear)
      .attr("cx", d.x + d.drift)  //move slightly left or right
      .attr("cy", d.y - 40)   //move upward by 40px
      .attr("opacity", 0.60)  //fade a little
      .on("end", function () {  //when transition ends
        d.x = Math.random() * width;  //reset that particle to a new position near the bottom and animate it again
        d.y = Math.random() * height;
        d.drift = (Math.random() - 0.5) * 20;

        d3.select(this)
          .attr("cx", d.x)
          .attr("cy", d.y)
          .attr("opacity", 0.60);

        animateParticle(d3.select(this), d);
      });
  }

  circles.each(function (d) {
    animateParticle(d3.select(this), d);
  });
}
