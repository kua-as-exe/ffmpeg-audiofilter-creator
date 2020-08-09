import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StorageComponent } from '../components/shared/storage/storage.component';
import { MediaFile } from './../../../../../src/storage'
import { Observer, Observable } from 'rxjs';
import { ServerService } from './server.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  bsModalRef: BsModalRef;

  files: MediaFile[] = [];

  constructor(
    private bsModalService: BsModalService,
    private serverService: ServerService,
    private firestore: AngularFirestore
  ) {
    console.log("Init storage service");
  }

  async getFiles(): Promise<MediaFile[]>{
    let res: any = await this.serverService.requestGET('/api/getLocalFiles').toPromise();
    let localFiles:MediaFile[] = res.localFilesData
    
    this.files = []; // reset the files array
    localFiles = localFiles.map( file => {
      file.status = 'local';
      return file
    })

    this.files = localFiles

    let filesIDs = this.files.map( file => file.id)

    this.firestore.collection('storageMediaData').get().toPromise().then( snapshot => {
      snapshot.docs.forEach( fireFile => {
        if(filesIDs.includes( fireFile.id )){
          
          this.files.filter(file => file.id == fireFile.id)[0].status = 'firebase-local'

        }else{
          console.log("Este archivo está completamente en la nube: ", fireFile.data());
          let fireFileData: any = fireFile.data()
          fireFileData.status = 'firebase'
          this.files.push(fireFileData)
        }
      })
    })

    return this.files;
  }

  deleteFile = async (fileToDelete: MediaFile): Promise<void> => {
    await this.serverService.apiPOST('deleteFile', {fileToDelete});
    if(fileToDelete.status == 'firebase-local') fileToDelete.status = 'firebase'
  }

  uploadFile = async (fileToUpload: File): Promise<MediaFile> => {
      let uploadedFile = await this.serverService.postFile(fileToUpload).toPromise()
      uploadedFile.status = 'local';
      this.files.push(uploadedFile);
      return uploadedFile;
    }

  uploadFileToFirebase = async (fileToUpload: MediaFile) => {
    let uploadedMedia: MediaFile = await this.serverService.apiPOST('uploadToFirebase', fileToUpload)   

    await this.firestore.collection('storageMediaData')
      .doc(uploadedMedia.id)
      .set(uploadedMedia)
    
    fileToUpload.status = 'firebase-local';
    return fileToUpload;
    
  }

  downloadFromFirebase = async (fileToDownload:MediaFile) => {
    let res = await this.serverService.apiPOST('downloadFromFirebase', fileToDownload)
    if(res.file) fileToDownload = res.file
    return fileToDownload;
  }

  showModal(initialState: object = {}): Promise<MediaFile>{
    return new Promise( async (resolve, reject) => {
      
      // adjunta el estado inicial de la función showModal la información de los archivos locales (Local Files)

      // Inicia el modal
      this.bsModalRef = this.bsModalService.show(StorageComponent, { initialState })

      // espera a que el modal cierre y se desuscribe cuando haya finalizado, mandando una promesa
      let s = this.bsModalService.onHidden.subscribe( ()=>{
        resolve(this.bsModalRef.content.fileSelected);
        s.unsubscribe();
      })
    })
  }
}