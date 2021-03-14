import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applayout',
  templateUrl: './applayout.component.html',
  styleUrls: ['./applayout.component.css']
})
export class ApplayoutComponent implements OnInit {

  public isMenuOpen = false;

  constructor() { }

  ngOnInit() {
  }

  onSidenavClick() {
    this.isMenuOpen = false;
  }
}
