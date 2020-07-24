import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { interval } from 'rxjs';

export interface FilterParams {
  name: string
  id: string,
  params: object,
  comment: string,
}

export interface FiltersChain {
  id: string,
  name: string,
  description: string,
  filters: FilterParams[],
  categories: string[]
}

@Injectable({
  providedIn: 'root'
})
export class FiltersChainsService {

  firestoreCollection = 'filterChains';
  chains: FiltersChain[] = []

  constructor(
    private firestore:AngularFirestore
  ) {
    this.firestore.collection(this.firestoreCollection).stateChanges().subscribe(chainFireSnapshot => {
      chainFireSnapshot.forEach( fireChain => {
        let chainData = this.fire2Data(fireChain.payload.doc);

        let existLocalChain = this.chains.filter( localChain => localChain.id === chainData.id).length 
        if(existLocalChain == 0) this.chains.push(chainData)
        else
        this.chains.forEach(
          (localChain, index) => {
            if(localChain.id === chainData.id)
              this.chains[index] = chainData;
          }
        )
      })
    })



  }

  fire2Data = (fireData: DocumentData): FiltersChain => {
    let chainID = fireData.id;
    let chainData = fireData.data()

    return ({
      id: chainID,
      name: chainData.name || "Sin nombre",
      description: chainData.description || "Sin descripción",
      categories: chainData.categories || [],
      filters: chainData.filters || []
    })
  };

  getChain(chainID: string): Promise<FiltersChain>{
    return new Promise( (resolve) => {
      let chains = this.chains;
      interval(100).subscribe( function(time){
        if(chains.length > 0) {
          this.unsubscribe();

          let chain = chains.filter( chain => chain.id == chainID)[0];
          resolve(chain);
        }
      })
    })
  }

  writeFilter = (filterChain: FiltersChain) => this.firestore.collection(this.firestoreCollection).doc(filterChain.id).set(filterChain) 
}
