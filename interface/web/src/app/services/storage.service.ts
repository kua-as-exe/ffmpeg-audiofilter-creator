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
  localFiles: MediaFile[] = [];

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

  deleteFile = async (index: number): Promise<void> => {
    this.serverService.deleteFile(this.files[index])
    this.files = this.files.filter( (f, f_index) => index != f_index)
  }

  uploadFile = async (fileToUpload: File): Promise<MediaFile> => {
      let uploadedFile = await this.serverService.postFile(fileToUpload).toPromise()
      uploadedFile.status = 'local';
      this.files.push(uploadedFile);
      return uploadedFile;
    }

  uploadFileToFirebase = async (fileToUpload: MediaFile) => {
    let uploadedMedia: MediaFile = await this.serverService.apiPOST('uploadToFirebase', fileToUpload).toPromise()    

    await this.firestore.collection('storageMediaData')
      .doc(uploadedMedia.id)
      .set(uploadedMedia)
    
    fileToUpload.status = 'firebase-local';
    
  }

  downloadFromFirebase = async (fileToDownload:MediaFile) => {
    await this.serverService.apiPOST('downloadFromFirebase', fileToDownload).toPromise()

    fileToDownload.status = 'firebase-local';
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