import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Param, FilterOptions } from './../../../../../src/Filter'
import { Observable } from 'rxjs';
import { MediaFile } from '../../../../../src/storage';
//import { join } from 'path';

interface weveformResponse {
  'waveFormUrl': string,
  'proccess': any,
  'processed': boolean
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
 
  constructor(
    private http:HttpClient
  ) { 
    console.log("SERVER SERVICE WORKING");
  }
  requestGET = (url: string): Observable<any> => this.http.get(url)
  apiGET = (query: string): Promise<any> => this.requestGET('/api/'+query).toPromise()

  requestPOST = (url: string, data:any): Observable<any> => this.http.post(url, data)
  apiPOST = (query: string, data:any): Promise<any> => this.http.post('/api/'+query, data).toPromise()

   getFilters = () => this.apiGET('getFilters')

   getFilter = (filterName: string) => this.http.get('/api/getFilter?filterName='+filterName)


  waveForm = async (fileUrl: string): 
    Promise<weveformResponse> => 
    new Promise( (resolve, reject) => {
      console.log("sending post waveform: ", fileUrl);
      this.requestPOST('/api/getWaveForm', {fileUrl}).subscribe( (res:weveformResponse) => {
          console.log(res);
          res.proccess
          resolve(res);
        })
    })

  processAudioFilter = async (fileUrl: string, filtersLine: string): Promise<{'processedAudioSrc': string}> => 
    new Promise( (resolve, reject) => {

      console.log("mandando petición de procesamiento: ", fileUrl);
      this.requestPOST('/api/processAudio', {fileUrl, filtersLine}).subscribe( (res:any) => {
        console.log(res.ffmpegOutput);
          resolve({
            processedAudioSrc: res.processedAudio
          });
        })
    })

  deleteFile = async (fileToDelete: MediaFile): Promise<void> => {
    await this.requestPOST('/api/deleteFile', {fileToDelete}).toPromise();
  }

  postFile(fileToUpload: File): Observable<MediaFile> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.requestPOST('/api/upload', formData);
  }
}
