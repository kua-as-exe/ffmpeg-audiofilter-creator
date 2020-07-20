import { Component, OnInit } from '@angular/core';
import { FiltersChainsService, FiltersChain } from 'src/app/services/filters-chains.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filter-chain',
  templateUrl: './filter-chain.component.html',
  styleUrls: ['./filter-chain.component.css']
})
export class FilterChainComponent implements OnInit {

  chain: FiltersChain

  constructor(
    private filtersChainService: FiltersChainsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( async (params) => {
      let chainID: string = params['chainID']
      this.chain = await this.filtersChainService.getChain(chainID)
    })
  }

}
