// Generates a jittered grid of clip-path polygons that tile a box seamlessly
// at rest, so N duplicated copies of the same text read as one solid surface
// until each piece is animated independently.

function jitteredAxis(count, jitterFraction) {
  const step = 100 / count;
  const points = [];
  for (let i = 0; i <= count; i++) {
    const base = i * step;
    const isEdge = i === 0 || i === count;
    const jitter = isEdge ? 0 : (Math.random() - 0.5) * step * jitterFraction;
    points.push(base + jitter);
  }
  return points;
}

export function generateShards({ rows, cols, jitterFraction = 0.55, maxDistance = 340, mode = "desktop" }) {
  const xs = jitteredAxis(cols, jitterFraction);
  const ys = jitteredAxis(rows, jitterFraction);

  const shards = [];
  let id = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = xs[c];
      const x1 = xs[c + 1];
      const y0 = ys[r];
      const y1 = ys[r + 1];

      const clipPath = `polygon(${x0}% ${y0}%, ${x1}% ${y0}%, ${x1}% ${y1}%, ${x0}% ${y1}%)`;

      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;

      // direction outward from the box center (50, 50)
      const dx = cx - 50;
      const dy = cy - 50;
      const len = Math.max(Math.hypot(dx, dy), 0.001);
      const nx = dx / len;
      const ny = dy / len;

      // randomize magnitude and add a touch of perpendicular drift for realism
      const distance = maxDistance * (0.55 + Math.random() * 0.65) * (mode === "mobile" ? 0.7 : 1);
      const perpDrift = (Math.random() - 0.5) * maxDistance * 0.35;

      const tx = nx * distance + -ny * perpDrift;
      const ty = ny * distance + nx * perpDrift;

      const rotate = (Math.random() - 0.5) * 2 * (140 + Math.random() * 60);
      const delay = Math.random() * 110;
      const duration = 520 + Math.random() * 220;

      shards.push({ id: id++, clipPath, tx, ty, rotate, delay, duration });
    }
  }

  return shards;
}
