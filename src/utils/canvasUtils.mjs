//==================================
// Import
//==================================
import { randInt, getRandomRGB } from "./globals.mjs";

//==================================
// Classes
//==================================
export class Canvas {
  constructor(width, height, tot_points) {
    this.width = width;
    this.height = height;
    this.canvas_element = undefined;
    this.ctx = undefined;
    this.has_bounced = false;
    this.points = [];
    this.point = {
      x: null,
      y: null,
      radius: null,
      angle: null,
      moveX: null,
      moveY: null,
      velocity: null,
      color: null,
    };
    this.tot_points = tot_points;
  }

  /**
   * Initialize canvas object and context
   */
  initCanvas() {
    this.canvas_element = document.createElement("canvas");
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.styleCanvas();
    this.ctx = this.canvas_element.getContext("2d");
    document.body.appendChild(this.canvas_element);
    return this.canvas_element;
  }

  styleCanvas() {
    Object.assign(this.canvas_element.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "transparent",
      border: "3px solid #333",
    });
  }

  /**
   * Initialize the points with required parameters
   */
  initPoints() {
    for (let i = 1; i <= this.tot_points; i++) {
      const radius = i * (1.618 / 10);
      this.points.push({
        x: this.width / 2,
        y: this.height - radius - 0.5,
        radius: radius,
        angle: randInt(50, 130),
        velocity: i * 0.02,
        moveX: undefined,
        moveY: undefined,
        color: `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`,
      });
    }
  }

  /**
   * Execute this function in a loop to update the canvas and display the animation
   */
  update() {
    this.clearCanvas();
    this.drawPoints();
  }

  /**
   * Unmount canvas element from the DOM
   */
  unmount() {
    this.canvas_element.remove();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
  }

  drawPoints() {
    for (let i = 0; i < this.tot_points; i++) {
      const point = this.points[i];
      const next_point = this.points[i + 1] || undefined;
      this.calcDirection({point});
      const has_bounced = this.bounceToBoundaries({point});
      point.x += point.moveX;
      point.y += point.moveY;
      // point.color = has_bounced ? getRandomRGB() : point.color;
      this.drawCircle(point);
      // if (next_point) {
        // this.drawLine({point, next_point});
      // }
    }
  }

  calcDirection({point}) {
    if ( !point.moveX ) {
      point.moveX = Math.cos((Math.PI / 180) * point.angle) * point.velocity;
    }
    if ( !point.moveY ) {
      point.moveY = Math.sin((Math.PI / 180) * point.angle) * point.velocity;
    }
  }

  drawCircle({ x, y, radius, color, counterclockwise }) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, counterclockwise || false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawLine({ point, next_point }) {
    this.ctx.lineWidth = point.radius * 2;
    this.ctx.strokeStyle = point.color;
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(next_point.x, next_point.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  bounceToBoundaries({ point }) {
    let has_bounced = false;
  
    if (point.x >= this.width - point.radius || point.x <= point.radius) {
      point.moveX = -point.moveX;
      has_bounced = true;
    }
  
    if (point.y >= this.height - point.radius || point.y <= point.radius) {
      point.moveY = -point.moveY;
      has_bounced = true;
    }
  
    this.has_bounced = has_bounced;
    return has_bounced;
  }
}
