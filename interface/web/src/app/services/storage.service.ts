import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StorageComponent } from '../components/shared/storage/storage.component';
import { MediaFile } from './../../../../../src/storage'
import { Observer, Observable } from 'rxjs';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  bsModalRef: BsModalRef;

  localFiles: MediaFile[] = [];

  constructor(
    private bsModalService: BsModalService,
    private serverService: ServerService
  ) {
    console.log("Init storage service");
  }

  async getLocalFiles(): Promise<MediaFile[]>{
    let res: any = await this.serverService.requestGET('/api/getLocalFiles').toPromise();
    this.localFiles = res.localFilesData
    return this.localFiles;
  }

  deleteFile = async (index: number): Promise<void> => {
    this.serverService.deleteFile(this.localFiles[index])
    this.localFiles = this.localFiles.filter( (f, f_index) => index != f_index)
  }

  uploadFile = async (fileToUpload: File): Promise<MediaFile> => {
      let uploadedFile = await this.serverService.postFile(fileToUpload).toPromise()
      this.localFiles.push(uploadedFile);
      return uploadedFile;
    }

  showModal(initialState: object = {}): Promise<MediaFile>{
    return new Promise( async (resolve, reject) => {
      
      // adjunta el estado inicial de la función showModal la información de los archivos locales (Local Files)
      initialState = Object.assign(initialState, {
        localFiles: await this.getLocalFiles()
      })

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