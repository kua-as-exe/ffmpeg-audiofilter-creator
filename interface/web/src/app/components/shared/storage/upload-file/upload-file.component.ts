import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';
import { MediaFile } from '../../../../../../../../src/storage';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  @Output() fileUploaded: EventEmitter<MediaFile>;
  fileToUpload: File = null;

  constructor(
    private serverService: ServerService,
    private storageService: StorageService
  ) {
    this.fileUploaded = new EventEmitter();
  }

  ngOnInit(): void {
  }
  
  handleFileInput(files: FileList){
    this.fileToUpload = files.item(0);
  }

  upload(){
    this.storageService.uploadFile(this.fileToUpload).then( resFile => {
      this.fileUploaded.emit(resFile)
    })
  }

}
