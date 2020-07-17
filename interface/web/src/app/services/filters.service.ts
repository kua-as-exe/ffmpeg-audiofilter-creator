import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { FilterOptions } from '../../../../../src/Filter';
import { Observable } from 'rxjs';

export type Filter = FilterOptions

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  filterColection = 'filters';

  constructor(
    private firestore:AngularFirestore
  ) { }

  firestore2Filter = ( fireData: DocumentData): Filter => {
    let filterID = fireData.id;
    let filterData = fireData.data();

    return({
      id: filterID,
      name: filterData.name || "Sin nombre",
      label: filterData.label || "No_label",
      description: filterData.description || "Sin descripción", 
      default_params: filterData.default_params || [],
      structure: filterData.structure || {},
    })
  }

  getFilters():Promise<Filter[]>{
    return new Promise( (resolve, reject) => 
    this.firestore.collection(this.filterColection).get().subscribe( (filters) => { 
      
      let filtersData: FilterOptions[] = []
      filters.forEach( (filterData) => {
        let filter = this.firestore2Filter(filterData);
        filtersData.push( filter );
      })
      
      resolve(filtersData);
    }))
  }

  addFilter = ():Promise<DocumentReference> =>
    this.firestore.collection(this.filterColection).add({})
  
  async getFilter(filterID: string): Promise<Filter>{
    let filterData = await this.firestore.collection(this.filterColection).doc(filterID).get().toPromise()
    return this.firestore2Filter(filterData)    
  };

  deleteFilter = (filterID:string) => this.firestore.collection(this.filterColection).doc(filterID).delete()

  writeFilter = (filterData: Filter) => this.firestore.collection(this.filterColection).doc(filterData.id).set(filterData) 
  

}
