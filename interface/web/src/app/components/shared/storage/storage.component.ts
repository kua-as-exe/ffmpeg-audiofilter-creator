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
    this.updateFiles()
  }

  fileUploaded(e){
    this.showUpload = false;
  }

  selectFile(file: MediaFile){
    this.fileSelected = file;
    this.modalRef.hide();
  } 

  async uploadFile(file: MediaFile){
    await this.storageService.uploadFileToFirebase(file);
    this.updateFiles();

  }

  async downloadFile(file: MediaFile){
    await this.storageService.downloadFromFirebase(file);
    this.updateFiles();
  }

  async deleteFile(file: MediaFile){
    await this.storageService.deleteFile(file);
    this.updateFiles()
  }

  async updateFiles(){
    await this.storageService.getFiles()
    this.files = this.storageService.files;
  }
 
}