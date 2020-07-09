import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const headers = new HttpHeaders().set('Content-Type', 'text/plain');
    this.http.get('api/conection', {headers: headers}).subscribe( data => {
      console.log(data)
    }, (err: any) => {
      console.error(err)
    })
  }
}
