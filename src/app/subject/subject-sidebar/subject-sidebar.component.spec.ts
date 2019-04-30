import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSidebarComponent } from './subject-sidebar.component';

describe('SubjectSidebarComponent', () => {
  let component: SubjectSidebarComponent;
  let fixture: ComponentFixture<SubjectSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
