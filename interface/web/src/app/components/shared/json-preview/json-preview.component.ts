import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.css']
})
export class JsonPreviewComponent implements OnInit {

  @Input() data = {};

  constructor() { }

  ngOnInit(): void {
  }

}
