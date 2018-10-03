import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ComponentControl } from '../../../../model/ui-model';

@Component({
  selector: 'app-editor-insert-code',
  templateUrl: './insert-code.component.html',
  styleUrls: ['./insert-code.component.css']
})
export class InsertCodeComponent implements OnInit, OnChanges {

  // properties
  @Input() data: { code: string, lang: string };
  @Input() compControl: ComponentControl;
  @Input() compHeight: number | string;

  constructor() {
    this.compHeight = this.compHeight || 200;
  }

  ngOnInit() {
    if (!this.data) {
      this.data = { code: '', lang: '' };
    }
  }

  /** Watch for input changes and reassign modal control callbacks */
  ngOnChanges() {
    if (this.compControl) {
      this.compControl.submit = () => this.submit();
    }
  }

  /** Return component data */
  submit() {
    return this.data;
  }
}
