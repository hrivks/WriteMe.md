import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertYoutubeComponent } from './insert-youtube.component';

describe('InsertYoutubeComponent', () => {
  let component: InsertYoutubeComponent;
  let fixture: ComponentFixture<InsertYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
