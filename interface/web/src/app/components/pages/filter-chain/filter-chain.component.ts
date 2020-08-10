import { Component, OnInit } from '@angular/core';
//import {  } from 'src/app/services/filters-chains.service';
import { FiltersChainsService, FiltersChain, FilterParams } from 'src/app/services/filters-chains.service';
//export { FiltersChain, FilterParams, getFilterComplex } from "src/../../src/FilterChain'
import { ActivatedRoute, Router } from '@angular/router';
import { FiltersService, FilterParam } from 'src/app/services/filters.service';
import { StorageService } from 'src/app/services/storage.service';
import { MediaFile } from '../../../../../../../src/storage';
import { FilterOptions } from '../../../../../../../src/Filter';

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
    filters: [],
    filterComplexLine: ''
  }

  testMedia: MediaFile[] = []

  show = {
    filtersPanel: true
  }

  complexOut;

  constructor(
    private filtersChainService: FiltersChainsService,
    private filtersService: FiltersService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( async (params) => {
      let chainID: string = params['chainID']
      this.chain = await this.filtersChainService.getChain(chainID)
    })
  }

  firstFilter = ():FilterOptions => Object.assign({}, this.filtersService.filters[0]);
  filterChanged = (filter, index) => this.chain.filters[index] = filter;
  categoryChanged = (newCategory, index) =>  this.chain.categories[index] = newCategory;
  addCategory = () => this.chain.categories.push('');

  newFIlter = ()=>{
    let newFilter: FilterParams = {
      id: this.firstFilter().id,
      name: 'filter',
      comment: 'filter comment',
      params: {},
      options:{
        muted: false
      }
    }
    this.chain.filters.push(Object.assign({}, newFilter))
  }

  deleteFilter = (index: number) => this.chain.filters = this.chain.filters.filter( (filter, filterIndex) => filterIndex != index );
  categoryDeleted = (index: number) => this.chain.categories = this.chain.categories.filter( (category, categoryIndex) => categoryIndex != index );

  deleteMediaTest = (index: number) => {
    this.testMedia = this.testMedia.filter( (media, media_index) => media_index != index);
  }

  save = () => this.filtersChainService.writeFilter(this.chain);
  delete = () => {
    this.filtersChainService.deleteChain(this.chain.id);
    //this.router.navigate(['/filterChainsManager']);
  }
  clone = () => {
    this.filtersChainService.cloneChain(this.chain);
    //this.router.navigate(['/filterChainsManager']);
  }
  
  complex = () => this.chain.filterComplexLine = this.filtersChainService.getChainComplexLine(
    this.chain.filters.filter(filter => (filter.options && !filter.options.muted)),
    this.filtersService.filters
    )

  showStorage = async () => {
    let fileSelected = await this.storageService.showModal()

    // checa por cada archivo de prueba si aún existe en los archivos del programa
    // por la posibilidad de haber sido eliminados
    // en dado caso los filtra y remueve para evitar que la app explote
    this.testMedia = this.testMedia.filter( (media) => {
      let exists = false;
      this.storageService.files.forEach( (file) => {
        if(file.filename == media.filename && (file.status == 'firebase-local' || file.status == 'local')) {
          exists = true;
        }
      })
      return exists;
    })
    
    // adjunta el archivo si se seleccionó alguno
    if(fileSelected) this.testMedia.push(fileSelected);
  }

  process = async () => {
    console.log(this.complex());

    this.testMedia.forEach( (media, index) => {
      this.filtersChainService.processMedia(media, this.chain)
      .then( res => {
        if(res.media) this.testMedia[index] = res.media
        console.log(res)
      }).catch( err => {
        console.log(err);
      });
      
    })
    

  }

  
}
