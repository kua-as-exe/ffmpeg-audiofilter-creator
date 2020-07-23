import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { FilterOptions, Param } from '../../../../../src/Filter';
import { Observable, interval } from 'rxjs';

export type Filter = FilterOptions
export type FilterParam = Param;

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  filterColection = 'filters';

  filters: Filter[] = [];

  constructor(
    private firestore:AngularFirestore
  ) {
    this.firestore.collection(this.filterColection).stateChanges().subscribe( filtersFireSnapshot => {
      filtersFireSnapshot.forEach( fireFilter => {
        let filterData = this.firestore2Filter(fireFilter.payload.doc)

        let existLocalFilter = this.filters.filter( (localFilter) => localFilter.id === filterData.id).length
        if(existLocalFilter == 0) this.filters.push(filterData)
        else
          this.filters.forEach( 
            (localFilter, index) => { 
              if(localFilter.id === filterData.id)
                this.filters[index] = filterData;
            }
          )

      })
    })
  }

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

  addFilter = ():Promise<DocumentReference> =>
    this.firestore.collection(this.filterColection).add({})
  
  getFilter = (filterID: string): Promise<Filter> =>
    new Promise( (resolve) => {
      let filters = this.filters;
      interval(100).subscribe( function(time){
        if(filters.length > 0) {
          this.unsubscribe();

          let filter = filters.filter( filter => filter.id == filterID)[0];
          resolve(filter);
        }
      })
    })

  deleteFilter = (filterID:string) => this.firestore.collection(this.filterColection).doc(filterID).delete()

  writeFilter = (filterData: Filter) => this.firestore.collection(this.filterColection).doc(filterData.id).set(filterData) 
  

}
