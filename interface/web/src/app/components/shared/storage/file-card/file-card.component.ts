import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MediaFile } from '../../../../../../../../src/storage';


@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css']
})
export class FileCardComponent implements OnInit {

  @Input() file: MediaFile;
  @Output() deleteFile: EventEmitter<any>;
  @Output() selectFile: EventEmitter<MediaFile>;
  @Output() uploadFile: EventEmitter<MediaFile>;
  @Output() downloadFile: EventEmitter<MediaFile>;

  showDetails: boolean = false;
  mediaPath:string = null;

  constructor() {
    this.deleteFile = new EventEmitter();
    this.selectFile = new EventEmitter();
    this.uploadFile = new EventEmitter();
    this.downloadFile = new EventEmitter();
  }

  ngOnInit(): void {
    if(this.file.status == 'local' || this.file.status == 'firebase-local')
      this.mediaPath = 'media/'+this.file.filename+'/'+this.file.filename
    else if(this.file.status == 'firebase')
      this.mediaPath = this.file.downloadUrl
  }

  delete(){
    this.deleteFile.emit()
  }

  select(){
    this.selectFile.emit(this.file)
  }

  upload(){
    this.uploadFile.emit(this.file)
  }

  download(){
    this.downloadFile.emit(this.file)
  }

}
