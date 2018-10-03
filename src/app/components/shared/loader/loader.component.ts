import { Component, OnInit } from '@angular/core';
import { InteractionsService } from '../../../services/interactions.service.client';
import { AppConstants } from '../../../app.constant';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  // properties
  private showLoader = false;

  constructor(private interactionService: InteractionsService) { }

  ngOnInit() {
    this.interactionService.registerCallback(AppConstants.EVENTS.showLoader, (d) => { this.toggleLoader(d); }, true);
  }

  /**
   * Show / hide loader
   * @param val true to show, false to hide
   */
  toggleLoader(val: boolean) {
    this.showLoader = val;
  }
}
