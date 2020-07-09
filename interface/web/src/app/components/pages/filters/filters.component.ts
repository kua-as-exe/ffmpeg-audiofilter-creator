import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  constructor(
    private router: Router,
    private server: ServerService
  ) { }

  ngOnInit(): void {

    this.server.checkConnection()
  }

  gotoFilter(x){
    console.log(x);

    //check if filter exists
    this.router.navigate(['/filter', x]);
  }


}
