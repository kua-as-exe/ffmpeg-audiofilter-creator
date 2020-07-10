import { Component, OnInit, EventEmitter } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { ActivatedRoute } from '@angular/router';
import { FilterOptions, Param } from '../../../../../../../src/Filter';
//import { BsModalService } from 'ngx-bootstrap/modal';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, ModalData } from './../../shared/modal/modal.component'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  filter: FilterOptions = {
    name: 'Loading Filter...',
    label: '',
    default_params: [],
    func: [],
    structure: {
      inputs: 1,
      outputs: 1
    }
  };

  constructor(
    private server: ServerService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
      console.log(params);
      let filterID = params['filterID']

      this.server.getFilter(filterID).subscribe( (filter: FilterOptions) => {
        this.filter = filter
        console.log(this.filter);
      })
    })
    
  }

  editParam(param:Param): void {
    console.log("Edit Param: ", param)
    let modal = this.modalService.open(ModalComponent, {
      keyboard: true
    });
    let modalData: ModalData = {
      title: param.key,
      data: param
    }
    modal.componentInstance.addData(modalData)

    let save: EventEmitter<any> = modal.componentInstance.save
    save.subscribe( (data) => {
      console.log(data);
      modal.close("ok")
    })

    let cancel: EventEmitter<any> = modal.componentInstance.cancel
    cancel.subscribe( (data) => {
      console.log(data);
      modal.dismiss()
    })

    modal.result.then( (msg) => console.log(msg)).catch( (msg) => console.log(msg))

  }

}
