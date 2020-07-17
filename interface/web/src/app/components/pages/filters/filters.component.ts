import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FiltersService, Filter } from 'src/app/services/filters.service';

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


  filters:Promise<Filter[]>;
    
  constructor(
    private router: Router,
    private filtersService: FiltersService,
  ) { }

  ngOnInit(): void {
    this.filters = this.filtersService.getFilters()
  }

  gotoFilter(filter: Filter | string){
      //check if filter exists
    if(typeof filter != "string") filter = filter.id
    this.router.navigate(['/filter', filter]);
  }

  async newFilter(){
    let newFilter = await this.filtersService.addFilter()
    this.gotoFilter(newFilter.id)
  }

}
