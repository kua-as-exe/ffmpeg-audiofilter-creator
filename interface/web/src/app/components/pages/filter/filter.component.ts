import { Component, OnInit, EventEmitter } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { ActivatedRoute } from '@angular/router';
import { FilterOptions, Param } from '../../../../../../../src/Filter';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { FiltersService } from 'src/app/services/filters.service';
//import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  test = "test"

  saveButton: boolean = false

  filter: FilterOptions = {
    id: '',
    name: 'Loading Filter...',
    label: '',
    default_params: [],
    func: [],
    structure: {
      inputs: 1,
      outputs: 1
    }
  };
  filterID: string = "-";
  delConfirm = false;
  delConfirmText = "¿Seguro que deseas eliminar?"

  defaultNewParam: Param = {
    key: "key", 
    value: "value", 
    editable: false,
    definition: {
      type: "range",
      range:{
        min: 0,
        max: 0
      },
      options: ['']
    }
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private filterService: FiltersService
  ) { }

  ngOnInit() {
    console.log("NgOnInit");
    this.activatedRoute.params.subscribe( async (params) => {
      let filterID: string = params['filterID']
      this.filter = await this.filterService.getFilter(filterID)
      console.log(this.filter.default_params);
    })
  }

  addParam = () => this.filter.default_params.push( Object.assign({}, this.defaultNewParam) );
  
  delSure = () => this.delConfirmText = "Simón, eliminar";
  delConfirmBtn = () => this.delConfirm = !this.delConfirm;
  delParam = (index) => this.filter.default_params = this.filter.default_params.filter( (obj, i) => i !== index);

  paramsDataChanged(data, id){
    this.filter.default_params[id].definition = data
  }

  async delFilter(){
    await this.filterService.deleteFilter(this.filter.id)
    this.router.navigate(['/filters'])
  }

  async save(){
    await this.filterService.writeFilter(this.filter)
    console.log(this.filter); 
  }

  async saveAndExit(){
    await this.save()
    this.router.navigate(['/filters'])
  }

} 
