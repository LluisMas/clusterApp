import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubmissionsComponent } from './admin-submissions.component';

describe('AdminSubmissionsComponent', () => {
  let component: AdminSubmissionsComponent;
  let fixture: ComponentFixture<AdminSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
