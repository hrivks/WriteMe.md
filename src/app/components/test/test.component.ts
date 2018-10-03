import { Component, OnInit } from '@angular/core';
import { ComponentControl } from '../../model/ui-model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private compControl: ComponentControl;
  private a: boolean;

  constructor() { }

  ngOnInit() {
    this.compControl = {};
  }

  submit(ico: string) {
    console.log(ico);
  }
}
