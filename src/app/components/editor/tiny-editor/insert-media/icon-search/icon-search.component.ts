import { Component, OnInit, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { IconSearchService } from '../../../../../services/iconsearch.service.client';
import { UtilService } from '../../../../../services/utils.service.client';
import { ComponentControl } from '../../../../../model/ui-model';
declare var $: any;

@Component({
  selector: 'app-icon-search',
  templateUrl: './icon-search.component.html',
  styleUrls: ['./icon-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IconSearchComponent implements OnInit, OnChanges {

  // properties
  @Input() compControl: ComponentControl;
  @Input() compHeight: number;
  private keyword: string;
  private err: string;
  private searchResultIcons: string[];
  private searchCount: number;
  private currentPage: number;
  private selectedImg: any;
  private aspectRatioLocked: boolean;
  private imgResizeControl: ComponentControl;

  constructor(private iconSearchService: IconSearchService, private utilService: UtilService) {

    this.searchResultIcons = [];
    this.searchCount = 0;
    this.aspectRatioLocked = true;
    this.imgResizeControl = {};

  }

  ngOnInit() {
    if (this.compControl) {
      this.compControl.submit = () => this.submit();
    }
  }

  ngOnChanges() {
    if (this.compControl) {
      this.compControl.submit = () => this.submit();
    }
  }

  /** Search for images */
  search() {

    if (!this.keyword) {
      return;
    }
    this.iconSearchService.search(this.keyword)
      .subscribe(
      (result) => {
        this.searchResultIcons = result.icons;
        this.searchCount = result.count;
      },
      (e) => {
        this.err = 'Oops! Icon search is acting up again!';
        console.error('Error searching for icons.', e);
      }
      );

  }

  /**
   * Select an image
   * @param img selected image object
   */
  selectImg(img) {

    this.selectedImg = img;
    this.selectedImg.selectedUrl = img.sizes[Math.floor(img.sizes.length * 0.75)].url;
    this.selectedImg.selectedSize = img.sizes[Math.floor(img.sizes.length * 0.75)].size;

  }

  /**
   * change size of selected image
   * @param size selected size object
   */
  selectSize(size: any | string) {

    if (size === 'custom') {
      this.selectedImg.selectedUrl = this.selectedImg.sizes[this.selectedImg.sizes.length - 1].url;
      this.selectedImg.selectedSize = 'custom';
    } else {
      this.selectedImg.selectedUrl = size.url;
      this.selectedImg.selectedSize = size.size;
    }

  }

  /** submit the selected image */
  submit(): { url: string, title: string } {

    if (this.selectedImg.selectedSize === 'custom') {
      const imgSize = this.imgResizeControl.submit();
      const url = this.utilService.getResizedImgUrl(this.selectedImg.url, imgSize.width, imgSize.height);
      return { url: url, title: this.selectedImg.title };
    } else {
      return { url: this.selectedImg.selectedUrl, title: this.selectedImg.title };
    }

  }

}
