
//==================================
// Import
//==================================
import { downloadFile } from './globals.mjs';

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



