import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface ModalData {
  title: string, 
  data: {

  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() modalData: ModalData = {
    title: 'título',
    data: {}
  };
  @Output() save: EventEmitter<any>;
  @Output() cancel: EventEmitter<any>;

  dataInputs: string[]

  constructor(ngbActiveModal: NgbActiveModal) {
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
  }

  ngOnInit(): void {
    
  }
  addData(data: ModalData){
    this.modalData = data;
    console.log(this.modalData)
    Object.keys(this.modalData.data).forEach( (key) => {
     console.log(key, this.modalData.data[key]);
    })
  }

  saveFunction(){
    this.save.emit('data')
  }

  cancelFunction(){
    this.cancel.emit('cancel')
  }

}
