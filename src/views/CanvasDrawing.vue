<template>
  <canvas ref="canvas_ref" :width="WIDTH" :height="HEIGHT" />
  <div class="toast-msg" :clas="{ 'fadein' : is_recording }"><p>Recording 📽️</p></div>
</template>

<script setup>
//==================================
// Import
//==================================
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import {
  Screen,
  randInt,
  VideoRecorder,
} from "../utils/globals.mjs";


//==================================
// Const
//==================================
const WIDTH      = Screen.instagram_reel_width / 3;
const HEIGHT     = Screen.instagram_reel_height / 3;
const FPS        = 35;
const TOT_POINTS = 100;

const ctx          = ref( undefined );
const canvas_ref   = ref( undefined );
const is_pause     = ref( false );
const points       = ref( [] );
const is_recording = ref( false );

let video = undefined;
let animation_frame = undefined;

//==================================
// Functions
//==================================
function initLoop() {
  getVideoFrame();
  clearCanvas();
  drawPoints();
  animation_frame = window.requestAnimationFrame(initLoop);
}

function getVideoFrame() {
  if ( video ) {
    video.getFrame();
  }
}

function clearCanvas() {
  ctx.value.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawPoints() {
  for (let i = 0; i < points.value.length; i++) {
    const p = points.value[i];
    const next_p = points.value[i+1] || undefined;
    calcDirection( p );
    const has_bounced = bounceToBoundaries( p );
    p.x += p.moveX;
    p.y += p.moveY;
    // p.color = has_bounced ? setColor() : p.color;
    drawCircle(p);
    if ( next_p ) {
      drawLine(p, next_p);
    }
  }
}

function drawLine(p, next_p) {
  ctx.value.lineWidth = p.radius * 2;
  ctx.value.strokeStyle = p.color;
  ctx.value.beginPath();
  ctx.value.moveTo(p.x, p.y);
  ctx.value.lineTo(next_p.x, next_p.y);
  ctx.value.closePath();
  ctx.value.stroke();
}

function setColor() {
  const rgb = {
    red: 255, //randInt(0, 255),
    green: randInt(100, 255),
    blue: 255, //randInt(0, 255),
  }
  return `rgb(${ rgb.red },${ rgb.green },${ rgb.blue })`;
}

function bounceToBoundaries( p ) {
  let has_bounced = false;
  if (p.x >= WIDTH - p.radius || p.x <= p.radius) {
    p.moveX = -p.moveX;
    has_bounced = true;
  }
  if (p.y >= HEIGHT - p.radius || p.y <= p.radius) {
    p.moveY = -p.moveY;
    has_bounced = true;
  }
  return has_bounced;
}

function calcDirection( p ) {
  if ( !p.moveX ) {
    p.moveX = Math.cos((Math.PI / 180) * p.angle) * p.velocity;
  }
  if ( !p.moveY) {
    p.moveY = Math.sin((Math.PI / 180) * p.angle) * p.velocity;
  }
}

function drawCircle({ x, y, radius, color }) {
  ctx.value.fillStyle = color;
  ctx.value.beginPath();
  ctx.value.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle, counterclockwise
  ctx.value.closePath();
  ctx.value.fill();
}

function initPoints() {
  for( let i = 1; i <= TOT_POINTS; i++ ) {
    const radius = i * (1.618 /10 );
    points.value.push({
      x: WIDTH/2,
      y: HEIGHT - radius - 0.5, 
      radius,
      angle: randInt(50, 130),
      velocity: i * 0.01,
      moveX: undefined,
      moveY: undefined,
      color: `rgb(255 ,${randInt(100, 255)}, 255)`,//`rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`,
    });
  }
}

function initRecord() {
  video = new VideoRecorder(canvas_ref.value, FPS);
  video.initRecord();
  is_recording.value = true;
}

function stopRecording() {
  is_recording.value = false;
  video.stopRecording();
}

function onkeydown(e) {
  if (e.code == "Space") {
    is_pause.value = !is_pause.value;
  }
}

//==================================
// Watch
//==================================
watch(is_pause, (newVal) => {
  newVal ? window.cancelAnimationFrame(animation_frame) : initLoop();
});

//==================================
// Life cycle
//==================================
onMounted(() => {
  window.addEventListener("keydown", onkeydown);
  ctx.value = canvas_ref.value.getContext('2d');
  initPoints();
  initLoop();
  initRecord();
});

onUnmounted(() => {
  stopRecording();
  window.cancelAnimationFrame(animation_frame);
  window.removeEventListener("keydown", onkeydown);
});


</script>

<style lang="scss" scoped>
.toast-msg {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px;
  background-color: #222;
  border-radius: 12px;
}

canvas {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 border: 2px solid #222;
 background-color: #eee;
}

</style>
