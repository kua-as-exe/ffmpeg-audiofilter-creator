import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FiltersChain, FilterParams } from 'src/app/services/filters-chains.service';
import { Filter, FiltersService, FilterParam } from 'src/app/services/filters.service';

@Component({
  selector: 'app-chain-filter',
  templateUrl: './chain-filter.component.html',
  styleUrls: ['./chain-filter.component.css']
})
export class ChainFilterComponent implements OnInit {

  @Output() filterParamsChange: EventEmitter<FilterParams>;
  @Output() deleteFilter: EventEmitter<any>;
  @Input() filterParams: FilterParams = {
    id: 'loading',
    comment: 'loading',
    name: 'loading',
    params: {},
    options: {
      muted: false
    }
  };
  filter: Filter = {
    id: 'loading',
    label: 'loading',
    name: 'loading',
    default_params: []
  }
  filters: Filter[] = [];
  hover: boolean = false;
  hoverAuto: boolean = true;

  constructor(
    private filtersService: FiltersService
  ) {
    this.filterParamsChange = new EventEmitter();
    this.deleteFilter = new EventEmitter();
  }

  async ngOnInit() {
    this.filter = await this.filtersService.getFilter(this.filterParams.id)
    this.filters = this.filtersService.filters;
    if(this.filterParams.options === undefined) this.filterParams.options = {
      muted: false
    }
  }

  changeInputField(data: FilterParam){
    this.filterParams.params[data.key] = data.value;
    this.emit()
  }
  
  changeHover(state: boolean){
    this.emit()
    if(this.hoverAuto)
      this.hover = state
  }

  delete(){
    this.deleteFilter.emit()
  }

  async filterIdChanged(){
    this.filter = await this.filtersService.getFilter(this.filterParams.id)
    this.filterParams.params = {};
  }

  emit(){
    this.filterParamsChange.emit(this.filterParams)
  }

}
