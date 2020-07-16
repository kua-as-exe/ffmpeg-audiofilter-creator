import { Component, OnInit, Input, ViewChild, EventEmitter, Output, } from '@angular/core';


@Component({
  selector: 'app-param-option',
  templateUrl: './param-option.component.html',
  styleUrls: ['./param-option.component.css', './../filter.component.css']
})
export class ParamOptionComponent implements OnInit {

  //type: "range"|"options";
  @Input() inputData = {
    type: 'range',
    range: {
      min: null,
      max: null
    },
    options: ['']
  }; 

  param = {
    type: 'range',
    range: {
      min: null,
      max: null
    },
    options: [{value:''}]
  }
  @Output() dataChanged:EventEmitter<any>;

  constructor() {
    this.dataChanged = new EventEmitter();    
  }

  ngOnInit(): void {
    this.param.type = this.inputData.type;
    this.param.range = Object.assign({}, this.inputData.range);
    this.param.options = this.inputData.options.map( option => {
      return {'value': option}
    });
  }

  toggleRangeOrOption(){
    if(this.param.type == "options") {
      this.param.type = "range"
    }else if(this.param.type == "range") {
      if(this.param.options.length == 0) this.addOption()
      this.param.type = "options"
    };
    this.save()
  }

  async addOption(){
    this.param.options.push({value:''})
  }
  removeOption(id){
    this.param.options = this.param.options.filter( (p, i) => i != id);
    this.save()
  }
  changeOption(event, id){
    let text:string = event.target.value;
    if(text.length == 0) this.removeOption(id);
    else this.addOption();
    this.save()
  }
  cleanOptions(){
    this.param.options.forEach( (option, id) => (option.value.length == 0)? this.removeOption(id): '' )
  }

  mouseout(){
    this.cleanOptions();
    this.save()
  }

  save(){
    let output: any = Object.assign({}, this.param);
    output.options = output.options.map( (param) => param.value);
    this.dataChanged.emit(output);
  }

}
