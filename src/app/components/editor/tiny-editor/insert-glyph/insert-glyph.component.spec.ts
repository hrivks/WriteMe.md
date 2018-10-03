import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertGlyphComponent } from './insert-glyph.component';

describe('InsertGlyphComponent', () => {
  let component: InsertGlyphComponent;
  let fixture: ComponentFixture<InsertGlyphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertGlyphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertGlyphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
