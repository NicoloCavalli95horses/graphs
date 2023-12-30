//==================================
// Const
//==================================
export const SCREEN_SIZE = Object.freeze({
  yt_width: 1920,
  yt_height: 1080,
  instagram_reel_width: 1080,
  instagram_reel_height: 1920,
});


//==================================
// Functions
//==================================
export function getRgb( rgb ) {
  const match = rgb.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? { red: parseInt(match[1]), green: parseInt(match[2]), blue: parseInt(match[3]) } : {};
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomRGB() {
  const rgb = {
    red: randInt(0, 255),
    green: randInt(100, 255),
    blue: randInt(0, 255),
  }
  return `rgb(${ rgb.red },${ rgb.green },${ rgb.blue })`;
}

function downloadFile(src, filename = 'untitled', format, width, height) {
  const a = document.createElement('a');
  a.href = src;
  a.download = `${filename}.${format}`;
  if (width && height) {
    a.style.width = `${width}px`;
    a.style.height = `${height}px`;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


//==================================
// Classes
//==================================
export class VideoRecorder {
  #VIDEO_OPTIONS;
  constructor(canvasRef, fps) {
    this.canvasRef = canvasRef;
    this.fps = fps;
    this.videoStream = undefined;
    this.mediaRecorder = undefined;
    this.frames = [];
    this.fps = 35;
    this.#VIDEO_OPTIONS = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    }
  }

  initRecord() {
    this.videoStream = this.canvasRef.captureStream(this.fps);
    this.mediaRecorder = new MediaRecorder(this.videoStream, this.#VIDEO_OPTIONS);
    this.mediaRecorder.ondataavailable = (e) => this.frames.push(e.data);
    this.mediaRecorder.onstop = () => this.handleStop();
    this.videoStream.getVideoTracks()[0].applyConstraints({
      width: this.canvasRef.width,
      height: this.canvasRef.height,
      advanced: [{ alpha: true }]  // Enable alpha channel for transparency
    });
    this.startRecording();
  }

  startRecording() {
    this.mediaRecorder.start();
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  getFrame() {
    this.videoStream.getVideoTracks()[0].applyConstraints({
      width: this.canvasRef.width,
      height: this.canvasRef.height
    });
    this.videoStream.getVideoTracks()[0].requestFrame();
  }

  handleStop() {
    const blob = new Blob(this.frames, { type: 'video/mp4' });
    const href = URL.createObjectURL(blob);
    downloadFile(href, 'test', 'mp4');
    URL.revokeObjectURL(href);
    this.frames = [];
  }
}



