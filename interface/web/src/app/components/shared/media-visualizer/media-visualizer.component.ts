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
  audioController: HTMLAudioElement

  audioTime: number;
  visualizerZoomX = 100;
  visualizerZoomY = 1;

  @Input() media: MediaFile;
  // = {
    //visualOriginal: '',
    //visualProcessed: '',
    //time: 0,
  //}
  @Output() delete: EventEmitter<void>;

  mediaPath: string
  metadata = {
    visualOriginal: '',
    visualProcessed: '',
    time: 0
  }

  constructor(
    private serverService: ServerService
  ) {
    this.delete = new EventEmitter()
  }

  ngOnInit(): void {
    this.mediaPath = 'media/'+this.media.path.base+'/'+this.media.path.base;
    console.log(this.media.path);
  }

  ngAfterViewInit(){
    this.audioController = this.audio.nativeElement
    this.testServer()
  }
  
  deleteVisualMedia(){
    this.delete.emit()
  }


  loaded(){
    console.log("Resource Lodaded");
  }

  timeUpdate(){
    this.metadata.time = this.audioController.currentTime
  }
  timeUpdateFromBar(){
    this.audioController.currentTime = this.metadata.time

  }
  
  async testServer(){
    let visualOriginal = (await this.serverService.waveForm(this.mediaPath)).waveFormUrl;
    console.log("VISUAL: ", {visualOriginal});
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