import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { Filter, FilterOptions } from '../../../../../../../src/Filter';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  filters: FilterOptions[];
    
  constructor(
    private router: Router,
    private server: ServerService
  ) { }

  ngOnInit(): void {
    this.server.getFilters().subscribe( (filters: FilterOptions[]) => this.filters = filters);
    //this.filters
  }

  gotoFilter(filter: FilterOptions){
      //check if filter exists
    this.router.navigate(['/filter', filter.name]);
  }


}
