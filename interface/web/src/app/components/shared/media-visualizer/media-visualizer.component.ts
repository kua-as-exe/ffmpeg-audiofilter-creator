import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, AfterContentInit, AfterViewChecked } from '@angular/core';
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
  visualizerZoomX = 100;
  visualizerZoomY = 1;

  @Input() media = {
    src: 'media/11.ogg',
    type: 'audio/ogg',
    visualOriginal: '',
    visualProcessed: '',
    time: 0,
  }

  test

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    this.audioController = this.audio.nativeElement
    this.testServer()
  }

  loaded(){
    console.log("Resource Lodaded");
  }

  timeUpdate(){
    this.media.time = this.audioController.currentTime
  }
  timeUpdateFromBar(){
    this.audioController.currentTime = this.media.time

  }
  
  async testServer(){
    let visualOriginal = (await this.serverService.waveForm(this.media.src)).waveFormUrl;
    console.log("VISUAL: ", {visualOriginal});
    this.media.visualOriginal = visualOriginal
  }

  async processAudio(){
    let serverResponse = await this.serverService.processAudioFilter(this.media.src, 'volume=volume=1.5')
    let visualProcessed = (await this.serverService.waveForm(serverResponse.processedAudioSrc)).waveFormUrl;
    console.log({visualProcessed});
    this.media.visualProcessed = visualProcessed
  }
}