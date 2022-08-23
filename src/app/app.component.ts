import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  title = 'take-a-selfie';

  camStream:any = null;
  loadVideo:boolean = false;

  private ipcRenderer:any;

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;

  ngAfterViewInit() {
    this.ipcRenderer = (window).require('electron').ipcRenderer;
  }

  openCamera() {
    if (this.camStream) return;

    const constraints = {
      video: true,
      audio: false
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.camStream = stream;
        this.loadVideo = true;
        const video = this.videoElement?.nativeElement;
        video.srcObject = this.camStream;
        video.play();
      }).catch(err => {
        console.log(err);
      })
  }

  stopCamera() {
    const video = this.videoElement?.nativeElement;
    video.pause();
    video.srcObject = null;

    this.camStream.getTracks().forEach((track:any) => {
      track.stop();
    });
    this.camStream = null;

    this.loadVideo = false;
  }

  snapshot() {
    const video = this.videoElement?.nativeElement;
    const canvas = this.canvasElement?.nativeElement;
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, 663, 500);
    const data = canvas.toDataURL('image/jpg')
    this.saveImage(data)
  }

  public saveImage(data: any): Promise<any> {
    return this.ipcRenderer.invoke('saveImage', data);
  }

}
