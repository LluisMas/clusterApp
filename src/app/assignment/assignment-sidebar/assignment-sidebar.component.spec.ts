import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSidebarComponent } from './assignment-sidebar.component';

describe('AssignmentSidebarComponent', () => {
  let component: AssignmentSidebarComponent;
  let fixture: ComponentFixture<AssignmentSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
