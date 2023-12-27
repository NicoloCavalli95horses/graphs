<template>
  <Canvas ref="canvas_ref" :width="WIDTH" :height="HEIGHT" />
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
import { Globals } from "../utils/globals.mjs";

import Canvas from "../components/Canvas.vue";

//==================================
// Const
//==================================
const WIDTH = Globals.yt_width / 2;
const HEIGHT = Globals.yt_height / 2;
const TOT_POINTS = 30;
const W_SEGMENT = WIDTH / TOT_POINTS;
// const HUE_INCREMENT = 30;
// const H_SEGMENT  = HEIGHT / TOT_POINTS;

const ctx        = ref( undefined );
const canvas_ref = ref( undefined );
const pause      = ref( false );
const points     = ref( [] );

let animation_frame = undefined;

//==================================
// Functions
//==================================
function initLoop() {
  animation_frame = window.requestAnimationFrame(initLoop);
  update();
}

function update() {
  setCanvas();
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

// function getRgb( rgb ) {
//   const match = rgb.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
//   return match ? {
//     red: parseInt(match[1]),
//     green: parseInt(match[2]),
//     blue: parseInt(match[3])
//   } : {};
// }

function setCanvas() {
  ctx.value.clearRect(0, 0, WIDTH, HEIGHT);
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

function onkeydown(e) {
  if (e.code == "Space") {
    pause.value = !pause.value;
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

//==================================
// Watch
//==================================
watch(pause, (newVal) => {
  newVal ? window.cancelAnimationFrame(animation_frame) : initLoop();
});

//==================================
// Life cycle
//==================================
onMounted(() => {
  window.addEventListener("keydown", onkeydown);
  ctx.value = canvas_ref.value.ctx;
  initPoints();
  initLoop();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animation_frame);
  window.removeEventListener("keydown", onkeydown);
});
</script>

<style lang="scss" scoped>
</style>
