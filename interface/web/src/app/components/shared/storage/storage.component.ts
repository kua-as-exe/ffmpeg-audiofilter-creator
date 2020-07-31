import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MediaFile } from '../../../../../../../src/storage';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

  title: string;
  message: string;
  localFiles: MediaFile[];

  showUpload: boolean = false;

  fileSelected: MediaFile

  constructor(
    public modalRef: BsModalRef,
    private storageService: StorageService
  ) {
    
  }
    
  ngOnInit(): void {
    this.localFiles = this.storageService.localFiles
  }

  fileUploaded(e){
    this.showUpload = false;
  }

  selectFile(file: MediaFile){
    this.fileSelected = file;
    this.modalRef.hide();
  } 

  async deleteFile(index){
    await this.storageService.deleteFile(index);
    this.localFiles = this.storageService.localFiles
  }
 
}