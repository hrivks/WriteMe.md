import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListSelectComponent } from './user-list-select.component';

describe('UserListSelectComponent', () => {
  let component: UserListSelectComponent;
  let fixture: ComponentFixture<UserListSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
