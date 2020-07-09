import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { join } from 'path';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
 
  constructor(
    private http:HttpClient
  ) { 
    console.log("SERVER SERVICE WORKING");
    this.checkConnection()
  }

  checkConnection(){
    this.http.get('/').subscribe( data => {
      console.log(data)
    })
  }
}
