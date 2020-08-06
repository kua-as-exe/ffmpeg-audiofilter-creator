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
  files: MediaFile[] = [];

  showUpload: boolean = false;

  fileSelected: MediaFile

  constructor(
    public modalRef: BsModalRef,
    private storageService: StorageService
  ) {
    
  }
    
  async ngOnInit() {
    await this.storageService.getFiles();
    this.files = this.storageService.files
    console.log(this.files);
  }

  fileUploaded(e){
    this.showUpload = false;
  }

  selectFile(file: MediaFile){
    this.fileSelected = file;
    this.modalRef.hide();
  } 

  uploadFile(file: MediaFile){
    this.storageService.uploadFileToFirebase(file);
  }

  downloadFile(file: MediaFile){
    this.storageService.downloadFromFirebase(file);
  }

  async deleteFile(index){
    await this.storageService.deleteFile(index);
    this.files = this.storageService.files
  }
 
}