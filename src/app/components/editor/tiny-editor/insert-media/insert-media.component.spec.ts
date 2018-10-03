import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertMediaComponent } from './insert-media.component';

describe('InsertMediaComponent', () => {
  let component: InsertMediaComponent;
  let fixture: ComponentFixture<InsertMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
