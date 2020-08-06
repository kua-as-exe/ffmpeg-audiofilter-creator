import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore:AngularFirestore
  ) { }
  
  getCollectionChanges = (collection: string) => 
    this.firestore.collection(collection).stateChanges();

  syncRealTime = () => {
    /*
    this.firebaseService.getCollectionChanges(this.filterColection).subscribe( filtersFireSnapshot => {
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
    */
  }

}
