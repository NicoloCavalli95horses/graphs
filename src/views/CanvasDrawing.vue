<template>
  <canvas ref="canvas_ref" :width="WIDTH" :height="HEIGHT" />
  <video :video_src="video_src" autoplay controls />
  <Btn v-if="is_recording" class="rec-btn" :def="false" @click="stopRecording">Stop video</Btn>
  <Btn v-else class="rec-btn" :def="false" @click="startRecording">Start video</Btn>
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
import { Screen, randInt } from "../utils/globals.mjs";

import Btn from "../components/Btn.vue";

//==================================
// Const
//==================================
const WIDTH      = Screen.yt_width / 2;
const HEIGHT     = Screen.yt_height / 2;
const TOT_POINTS = 30;
const W_SEGMENT  = WIDTH / TOT_POINTS;
const FPS = 20;

const ctx          = ref( undefined );
const canvas_ref   = ref( undefined );
const is_pause     = ref( false );
const points       = ref( [] );
const is_recording = ref( false );

let animation_frame = undefined;
let media_recorder  = undefined;
let video_stream    = undefined;
let frames          = [];
const video_src     = ref( undefined );

//==================================
// Functions
//==================================
function startRecording() {
  is_recording.value = true;
  media_recorder.start();
}

function stopRecording() {
  is_recording.value = false;
  media_recorder.stop();
}

function initLoop() {
  getVideoFrame();
  clearCanvas();
  drawPoints();
  animation_frame = window.requestAnimationFrame(initLoop);
}

function getVideoFrame() {
  if ( video_stream ) { 
    video_stream.getVideoTracks()[0].requestFrame();
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
    p.color = has_bounced ? setColor() : p.color;
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
    red: randInt(0, 255),
    green: randInt(0, 255),
    blue: randInt(0, 255),
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
    const radius = i * 0.1618;
    points.value.push({
      x: (W_SEGMENT * i) - (W_SEGMENT / 2) - i,
      y: radius + 0.5, 
      radius,
      angle: randInt(0, 360),
      velocity: i * 0.3,
      moveX: undefined,
      moveY: undefined,
      color: `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`,
    });
  }
}

function initRecord() {
  video_stream = canvas_ref.value.captureStream( FPS );
  media_recorder = new MediaRecorder( video_stream );
  media_recorder.ondataavailable = (e) => frames.push( e.data );
  media_recorder.onstop = () => {
    const blob = new Blob(frames, { 'type' : 'video/mp4' });
    video_src.value = URL.createObjectURL(blob);
    frames = [];
  };
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
  initRecord();
  initLoop();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animation_frame);
  window.removeEventListener("keydown", onkeydown);
});


</script>

<style lang="scss" scoped>
.rec-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
}
video {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 220px;
  height: auto;
  border: 1px solid #222;
}
canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #222;
  }
</style>
