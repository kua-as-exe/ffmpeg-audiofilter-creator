import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FiltersChain, FilterParams } from 'src/app/services/filters-chains.service';
import { Filter, FiltersService, FilterParam } from 'src/app/services/filters.service';

@Component({
  selector: 'app-chain-filter',
  templateUrl: './chain-filter.component.html',
  styleUrls: ['./chain-filter.component.css']
})
export class ChainFilterComponent implements OnInit {
  @ViewChild('collapse') col;

  @Input() filterParams: FilterParams = {
    id: 'loading',
    comment: 'loading',
    name: 'loading',
    params: ['loading']
  };
  filter: Filter = {
    id: 'loading',
    label: 'loading',
    name: 'loading',
    default_params: []
  }
  hover: boolean = false;

  constructor(
    private filtersService: FiltersService
  ) { }

  async ngOnInit() {
    console.log(this.filterParams);
    this.filter = await this.filtersService.getFilter(this.filterParams.id)
    console.log(this.filter);
  }

  changeInputField(data: FilterParam){
    this.filterParams.params[data.key] = data.value;
  }

}
