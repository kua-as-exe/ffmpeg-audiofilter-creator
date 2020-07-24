import { Component, OnInit } from '@angular/core';
import { FiltersChainsService, FiltersChain } from 'src/app/services/filters-chains.service';
import { ActivatedRoute } from '@angular/router';
import { FiltersService } from 'src/app/services/filters.service';

@Component({
  selector: 'app-filter-chain',
  templateUrl: './filter-chain.component.html',
  styleUrls: ['./filter-chain.component.css']
})
export class FilterChainComponent implements OnInit {

  chain: FiltersChain

  constructor(
    private filtersChainService: FiltersChainsService,
    private filtersService: FiltersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( async (params) => {
      let chainID: string = params['chainID']
      this.chain = await this.filtersChainService.getChain(chainID)
    })
  }

  filterChanged(filter, index){
    this.chain.filters[index] = filter;
    this.save()
  }

  newFIlter(){
    let firstFilter = this.filtersService.filters[0];
    this.chain.filters.push(Object.assign({}, {
      id: firstFilter.id,
      name: 'filter',
      comment: 'filter comment',
      params: {}
    }))
    console.log(this.chain.filters);
  }

  print(){
    console.log(this.chain)
    this.save()
  }

  save(){
    this.filtersChainService.writeFilter(this.chain);
  }

}
