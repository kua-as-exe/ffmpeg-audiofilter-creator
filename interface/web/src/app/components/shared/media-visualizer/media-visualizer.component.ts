import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-media-visualizer',
  templateUrl: './media-visualizer.component.html',
  styleUrls: ['./media-visualizer.component.css']
})
export class MediaVisualizerComponent implements OnInit, AfterViewInit  {
  
  @ViewChild('audioController') audio: ElementRef<HTMLAudioElement>; 
  audioController: HTMLAudioElement

  audioTime: number;
  visualizerZoom = 100;

  media = {
    src: 'media/11.ogg',
    type: 'audio/ogg',
    visual: '',
    time: 0,
    start: 0,
    end: 0
  }

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void{
    this.audioController = this.audio.nativeElement
    
    console.log(this.audioController);
    this.testServer()
  }

  timeUpdate(){
    this.media.time = this.audioController.currentTime
  }
  timeUpdateFromBar(){
    this.audioController.currentTime = this.media.time

  }
  
  async testServer(){
    let visual = (await this.serverService.waveForm(this.media.src)).waveFormUrl;
    console.log({visual});
    this.media.visual = visual
    this.media.start = 0
    this.media.end = this.audioController.duration
  }
}
