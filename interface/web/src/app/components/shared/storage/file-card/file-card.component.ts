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

  showDetails: boolean = false;
  mediaPath:string = null;

  constructor() {
    this.deleteFile = new EventEmitter();
    this.selectFile = new EventEmitter();
  }

  ngOnInit(): void {
    this.mediaPath = 'media/'+this.file.path.base+'/'+this.file.path.base
  }

  delete(){
    this.deleteFile.emit()
  }

  select(){
    this.selectFile.emit(this.file)
  }

}
