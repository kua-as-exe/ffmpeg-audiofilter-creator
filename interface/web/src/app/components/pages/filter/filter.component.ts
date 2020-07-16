import { Component, OnInit, EventEmitter } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import { ActivatedRoute } from '@angular/router';
import { FilterOptions, Param } from '../../../../../../../src/Filter';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
//import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe(params => { 
      console.log(params);
      let filterID = params['filterID']
      //this.filter = 
      this.firestore.collection('filters').doc(filterID).get().subscribe( (filter) => {
        let filterData = filter.data()
        console.log(filterData);
        this.filterID = filter.id;
        this.filter = {
          id: filter.id,
          name: filterData.name || "",
          label: filterData.label || "",
          description: filterData.description || "", 
          default_params: filterData.default_params || [],
          structure: filterData.structure || {},
        }
        console.log(this.filter);
      })
      
    })
    
  }

  addParam = () => this.filter.default_params.push( Object.assign({}, this.defaultNewParam) );
  
  delSure = () => this.delConfirmText = "Simón, eliminar";
  delConfirmBtn = () => this.delConfirm = !this.delConfirm;
  delParam = (index) => this.filter.default_params = this.filter.default_params.filter( (obj, i) => i !== index);

  paramsDataChanged(data, id){
    this.filter.default_params[id].definition = data
    console.log("Data changed: ", id, "=", data);
    console.log("Data changed: ", this.filter.default_params[id]);
  }

  async delFilter(){
    let out = await this.firestore.collection('filters').doc(this.filterID).delete()
    this.router.navigate(['/filters'])
  }

  async save(){
    console.log(this.filter); 
    await this.firestore.collection('filters').doc(this.filter.id).set( this.filter) 
  }

  async saveAndExit(){
    await this.save()
    this.router.navigate(['/filters'])
  }

} 
