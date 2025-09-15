const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize canvas when window changes
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const segments = [];
const length = 20; // number of reptile segments
const segmentLength = 20;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Initialize segments
for (let i = 0; i < length; i++) {
  segments.push({ x: mouse.x, y: mouse.y });
}

function update() {
  // Head follows mouse
  segments[0].x += (mouse.x - segments[0].x) * 0.2;
  segments[0].y += (mouse.y - segments[0].y) * 0.2;

  // Body follows previous segment
  for (let i = 1; i < segments.length; i++) {
    const dx = segments[i - 1].x - segments[i].x;
    const dy = segments[i - 1].y - segments[i].y;
    const angle = Math.atan2(dy, dx);

    segments[i].x = segments[i - 1].x - Math.cos(angle) * segmentLength;
    segments[i].y = segments[i - 1].y - Math.sin(angle) * segmentLength;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i < segments.length; i++) {
    // Calculate thickness (thicker at head, thinner at tail)
    let thickness = 6 - (i / segments.length) * 5; // head=6px, tail=1px
    ctx.strokeStyle = "white";
    ctx.lineWidth = thickness;

    // draw body
    ctx.beginPath();
    ctx.moveTo(segments[i - 1].x, segments[i - 1].y);
    ctx.lineTo(segments[i].x, segments[i].y);
    ctx.stroke();

    // draw legs (smaller towards tail)
    const dx = segments[i - 1].x - segments[i].x;
    const dy = segments[i - 1].y - segments[i].y;
    const angle = Math.atan2(dy, dx);

    const legLength = 10 - (i / segments.length) * 6; // shorter legs at tail

    ctx.beginPath();
    ctx.moveTo(segments[i].x, segments[i].y);
    ctx.lineTo(
      segments[i].x - Math.cos(angle + Math.PI / 2) * legLength,
      segments[i].y - Math.sin(angle + Math.PI / 2) * legLength
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(segments[i].x, segments[i].y);
    ctx.lineTo(
      segments[i].x - Math.cos(angle - Math.PI / 2) * legLength,
      segments[i].y - Math.sin(angle - Math.PI / 2) * legLength
    );
    ctx.stroke();
  }
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

animate();