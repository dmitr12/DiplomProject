import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-filterbar',
  templateUrl: './filterbar.component.html',
  styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent implements OnInit {

  @ViewChild('inputSearch', {static: false})
  input: ElementRef;
  @Input() placeholder = '';
  @Output() searchEvent = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.searchEvent.emit(this.input.nativeElement.value);
  }
}
