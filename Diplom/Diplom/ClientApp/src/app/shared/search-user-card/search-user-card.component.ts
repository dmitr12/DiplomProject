import {Component, Input, OnInit} from '@angular/core';
import {UserInfo} from "../../models/users/userInfo";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-user-card',
  templateUrl: './search-user-card.component.html',
  styleUrls: ['./search-user-card.component.css']
})
export class SearchUserCardComponent implements OnInit {
  @Input() userInfo: UserInfo;
  loaded = false;

  constructor(
  ) { }

  ngOnInit() {
  }

  imageLoaded() {
    this.loaded = true
  }
}
