import { Component, OnInit } from '@angular/core';
import { FiltersChainsService, FiltersChain} from 'src/app/services/filters-chains.service'

@Component({
  selector: 'app-filters-chain-manager',
  templateUrl: './filters-chain-manager.component.html',
  styleUrls: ['./filters-chain-manager.component.css'],
})
export class FiltersChainManagerComponent implements OnInit {

  filtersChain: FiltersChain[]

  constructor(
    private filtersChainsService:FiltersChainsService,
  ) { }

  ngOnInit(): void {
    this.filtersChain = this.filtersChainsService.chains
  }

  async newChain(){
    console.log("NEW FILTER");
  }

  //filterChain
  

}
