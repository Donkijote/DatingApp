import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoManagamentComponent } from './photo-managament.component';

describe('PhotoManagamentComponent', () => {
  let component: PhotoManagamentComponent;
  let fixture: ComponentFixture<PhotoManagamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoManagamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
