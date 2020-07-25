import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Param, FilterOptions, Filter } from './../../../../../src/Filter'
import { Observable } from 'rxjs';
//import { join } from 'path';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
 
  constructor(
    private http:HttpClient
  ) { 
    console.log("SERVER SERVICE WORKING");
  }
  requestGET = (url: string) => this.http.get(url)
  requestPOST = (url: string, data:any) => this.http.post(url, data)

   getFilters = () => this.http.get('/api/getFilters/')

   getFilter = (filterName: string) => this.http.get('/api/getFilter?filterName='+filterName)

  waveForm = async (fileUrl: string): Promise<{'waveFormUrl': string}> => 
    new Promise( (resolve, reject) => {
     
      console.log("sending post waveform: ", fileUrl);
      this.requestPOST('/api/getWaveForm', {fileUrl}).subscribe( (res:any) => {
        console.log("Response: ", res);
        resolve({
          waveFormUrl: res.waveFormUrl
        });
        })
    })
}
