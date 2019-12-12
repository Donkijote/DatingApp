import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagamentComponent } from './user-managament.component';

describe('UserManagamentComponent', () => {
  let component: UserManagamentComponent;
  let fixture: ComponentFixture<UserManagamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
