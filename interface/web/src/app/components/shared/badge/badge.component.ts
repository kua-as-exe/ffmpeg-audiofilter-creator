import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {

  @Input() text:string = "";
  @Input() editable:boolean = true;
  @Input() color:string = "primary";
  @Output() textChange: EventEmitter<string>
  @Output() delete: EventEmitter<any>

  editing:boolean = false

  constructor() {
    this.textChange = new EventEmitter();
    this.delete = new EventEmitter();
    console.log(this.editable);
  }

  ngOnInit(): void {
  }
  changeEdit = (value: boolean) => this.editable? (this.editing = value): '';
  deleteBadge = () => this.delete.emit();

  change(){
    console.log(this.text);
    this.textChange.emit(this.text)
  }

}
