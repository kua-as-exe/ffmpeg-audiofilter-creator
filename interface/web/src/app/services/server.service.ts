import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Param, FilterOptions, Filter } from './../../../../../src/Filter'
import { Observable } from 'rxjs';
//import { join } from 'path';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
 
  filters: FilterOptions[] = []

  constructor(
    private http:HttpClient
  ) { 
    console.log("SERVER SERVICE WORKING");
  }

   getFilters = () => this.http.get('/api/getFilters/')

   getFilter = (filterName: string) => this.http.get('/api/getFilter?filterName='+filterName)
}
