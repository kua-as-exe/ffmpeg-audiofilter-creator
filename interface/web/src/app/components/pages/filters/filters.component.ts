import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { Filter, FilterOptions } from '../../../../../../../src/Filter';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

interface filter {
  id:string,
  name: string,
  description: string,
  label: string
}
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {


  filters:FilterOptions[] = [];
    
  constructor(
    private router: Router,
    private server: ServerService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    //this.server.getFilters().subscribe( (filters: FilterOptions[]) => this.filters = filters);

    this.firestore.collection('filters').get().subscribe( (filters) => { 
      filters.forEach( (filter) => {
        let filterData = filter.data();
        console.log(filter.id);
        let f:FilterOptions = {
          id: filter.id,
          name: filterData.name || "Sin nombre",
          label: filterData.label || "NO_LABEL",
          description: filterData.description || "Sin descripción",
          default_params: filterData.default_params || []
        }
        console.log(f);
        this.filters.push(f);
      })
    });
    //this.filters
  }

  gotoFilter(filter: FilterOptions | string){
      //check if filter exists
    if(typeof filter != "string") filter = filter.id
    this.router.navigate(['/filter', filter]);
  }

  async newFilter(){
    let newFilter = await this.firestore.collection('filters').add({})
    this.gotoFilter(newFilter.id)
  }

}
