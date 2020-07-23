import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
})
export class InputFieldComponent  {
  @Input() model: any = {};
  @Input() type: "input" | "area" | "filterParam" | "none" = "none";
  
  // Output prop name must be Input prop name + 'Change'
  // Use in your component to write an updated value back out to the parent
  @Output() modelChange = new EventEmitter<object>();

  dataChanged(){
    this.modelChange.emit(this.model)
  }


}


