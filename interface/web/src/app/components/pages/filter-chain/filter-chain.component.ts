import { Component, OnInit } from '@angular/core';
//import {  } from 'src/app/services/filters-chains.service';
import { FiltersChainsService, FiltersChain } from 'src/app/services/filters-chains.service';
//export { FiltersChain, FilterParams, getFilterComplex } from "src/../../src/FilterChain'
import { ActivatedRoute } from '@angular/router';
import { FiltersService } from 'src/app/services/filters.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-filter-chain',
  templateUrl: './filter-chain.component.html',
  styleUrls: ['./filter-chain.component.css']
})
export class FilterChainComponent implements OnInit {

  chain: FiltersChain = {
    name: 'loading',
    id: 'loading',
    description: 'loading',
    categories: [],
    filters: []
  }

  testMedia:{
    type: string,
    src: string
  }[] = 
  [
    //{ src: 'media/far.ogg', type: 'audio/ogg'},
    //{ src: 'media/noticiero.mp3', type: 'audio/mp3'},
  ]

  show = {
    filtersPanel: true
  }

  complexOut;

  constructor(
    private filtersChainService: FiltersChainsService,
    private filtersService: FiltersService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( async (params) => {
      let chainID: string = params['chainID']
      this.chain = await this.filtersChainService.getChain(chainID)
    })
  }

  firstFilter = () => this.filtersService.filters[0];
  filterChanged = (filter, index) => this.chain.filters[index] = filter;
  categoryChanged = (newCategory, index) =>  this.chain.categories[index] = newCategory;
  addCategory = () => this.chain.categories.push('');

  newFIlter = ()=>
    this.chain.filters.push(Object.assign({}, {
      id: this.firstFilter().id,
      name: 'filter',
      comment: 'filter comment',
      params: {}
    }))

  deleteFilter = (index: number) => this.chain.filters = this.chain.filters.filter( (filter, filterIndex) => filterIndex != index );
  categoryDeleted = (index: number) => this.chain.categories = this.chain.categories.filter( (category, categoryIndex) => categoryIndex != index );

  save = () => this.filtersChainService.writeFilter(this.chain);
  complex = () => this.complexOut = this.filtersChainService.getChainComplexLine(this.chain.filters, this.filtersService.filters)

  showStorage = async () => {
    let fileSelected = await this.storageService.showModal()
    console.log("Archivo seleccionado:", fileSelected);
    this.testMedia.push({
      src: 'media/'+fileSelected.path.base+'/'+fileSelected.path.base,
      type: fileSelected.mimetype
    })
  }
}
