import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ComponentControl } from '../../../../model/ui-model';
import faIconsList from '../../../../model/fontawesome-icons-list';
import emojisList from '../../../../model/emojis-list';
import { AppConstants } from '../../../../app.constant';

@Component({
  selector: 'app-insert-glyph',
  templateUrl: './insert-glyph.component.html',
  styleUrls: ['./insert-glyph.component.css']
})
export class InsertGlyphComponent implements OnInit, OnChanges {

  // properties
  @Input() compControl: ComponentControl;
  @Output() onIconSelect: EventEmitter<{ type: string, icon: any }> = new EventEmitter<{ type: string, icon: any }>();
  private selectedSize: number | string;
  private selectedGlyph: string;
  private selectedType: string;
  private faIconsList: string[];
  private emojisList: { name: string, url: string }[];
  private iconUrl: string;

  constructor() {

    this.faIconsList = faIconsList;
    this.selectedSize = 'sm';
    this.iconUrl = AppConstants.APP_ROOT_URL + AppConstants.FA_ICONS_FOLDER_PATH + '/{size}/{icon}.png';
    this.selectedType = 'fa';
    this.emojisList = emojisList;

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

  selectIcon(ico: string) {

    this.selectedGlyph = ico;
    this.submit();

  }

  submit() {

    if (this.selectedType === 'fa') {

      let sizeFolderName = '';

      switch (this.selectedSize) {
        case 'sm':
          sizeFolderName = '24';
          break;
        case 'lg':
          sizeFolderName = '32';
          break;
        case '2x':
          sizeFolderName = '48';
          break;
        case '3x':
          sizeFolderName = '64';
          break;
        case '4x':
          sizeFolderName = '128';
          break;
        case '5x':
          sizeFolderName = '256';
          break;
      }

      const iconPath = this.iconUrl.replace('{size}', sizeFolderName).replace('{icon}', this.selectedGlyph);
      console.log(iconPath);
      this.onIconSelect.emit({ type: this.selectedType, icon: iconPath });

    } else {
      this.onIconSelect.emit({ type: this.selectedType, icon: this.selectedGlyph });
    }

  }

}
