import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ComponentControl } from '../../../../../model/ui-model';
import { UtilService } from '../../../../../services/utils.service.client';
declare var $;

@Component({
  selector: 'app-insert-youtube',
  templateUrl: './insert-youtube.component.html',
  styleUrls: ['./insert-youtube.component.css']
})
export class InsertYoutubeComponent implements OnInit, OnChanges {

  // properties
  @Input() compControl: ComponentControl;
  @Input() compHeight: number;
  private img: any;
  private aspectRatioLocked: boolean;
  private imgResizeControl: ComponentControl;

  constructor(private utilService: UtilService) {

    this.aspectRatioLocked = true;
    this.img = {};
    this.imgResizeControl = {};

  }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.compControl) {
      this.compControl.submit = () => this.submit();
      this.compControl.reset = () => this.reset();
    }

  }

  /** Get Img url of the video */
  getImgUrl() {

    if (this.img.videoUrl && this.img.videoUrl.indexOf('v=') > -1) {
      const videoId = this.img.videoUrl.split('v=')[1];
      if (videoId) {
        return 'http://img.youtube.com/vi/{videoId}/0.jpg'.replace('{videoId}', videoId);
      }
    } else {
      return '';
    }

  }

  /** Return data */
  submit(): { url: string, videoUrl: string, title: string } {

    let url = this.getImgUrl();
    if (this.img.customSize) {
      const imgSize = this.imgResizeControl.submit();
      url = this.utilService.getResizedImgUrl(url, imgSize.width, imgSize.height);
    }

    return { url: url, videoUrl: this.img.videoUrl, title: this.img.title || '' };

  }

  /** Reset form */
  reset() {

    this.img = {};

  }

}
