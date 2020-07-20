import { Component, OnInit, Input } from '@angular/core';
import { FiltersChain } from 'src/app/services/filters-chains.service';
import { FiltersService } from 'src/app/services/filters.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter-chain-card',
  templateUrl: './filter-chain-card.component.html',
  styleUrls: ['./filter-chain-card.component.css']
})
export class FilterChainCardComponent implements OnInit {

  @Input() chain: FiltersChain

  constructor(
    public filtersService: FiltersService,
    private router:Router
  ) { }

  ngOnInit(): void {
    console.log(this.chain);
    
  }

  gotoChain(){
    this.router.navigate(['/filterChain', this.chain.id]);
  }
}
