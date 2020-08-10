import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, AfterContentInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { MediaFile } from '../../../../../../../src/storage';

@Component({
  selector: 'app-media-visualizer',
  templateUrl: './media-visualizer.component.html',
  styleUrls: ['./media-visualizer.component.css']
})
export class MediaVisualizerComponent implements OnInit, AfterViewInit  {
  
  @ViewChild('audioController') audio: ElementRef<HTMLAudioElement>; 
  @ViewChild('audioController2') audio2: ElementRef<HTMLAudioElement>; 
  audioController: HTMLAudioElement
  audioController2: HTMLAudioElement

  audioTime: number;
  visualizerZoomX = 100;
  visualizerZoomY = 1;

  @Input() media: MediaFile;
  @Output() delete: EventEmitter<void>;

  mediaPath: string
  metadata = {
    visualOriginal: '',
    visualProcessed: '',
    time: 0,
  }

  mode: 'filter' | 'bypass' = 'bypass';
  showOutput: boolean = false;
  constructor(
    private serverService: ServerService
  ) {
    this.delete = new EventEmitter()
  }

  ngOnInit(): void {
    this.mediaPath = 'media/'+this.media.filename+'/'+this.media.filename;
  }

  ngAfterViewInit(){
    this.audioController = this.audio.nativeElement
    this.audioController2 = this.audio2.nativeElement
    this.testServer()
  }
  
  deleteVisualMedia(){
    this.delete.emit()
  }


  loaded(){
    console.log("Resource Lodaded");
  }

  timeUpdate(controller: number){
    if(controller == 0){
      this.audioController.currentTime = this.metadata.time;
      this.audioController2.currentTime = this.metadata.time;
    }
    if(controller == 1) this.metadata.time = this.audioController.currentTime
    if(controller == 2) this.metadata.time = this.audioController2.currentTime
  }
  
  async testServer(){
    let getWaveformResponse = await this.serverService.waveForm(this.mediaPath);
    let visualOriginal = getWaveformResponse.waveFormUrl;
    //console.log("VISUAL: ", {visualOriginal});
    this.metadata.visualOriginal = visualOriginal
  }

  async processAudio(){
    /*
    let serverResponse = await this.serverService.processAudioFilter(this.media.src, 'volume=volume=1.5')
    let visualProcessed = (await this.serverService.waveForm(serverResponse.processedAudioSrc)).waveFormUrl;
    console.log({visualProcessed});
    this.media.visualProcessed = visualProcessed
    */
  }
}