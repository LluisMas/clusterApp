import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentProgressComponent } from './assignment-progress.component';

describe('AssignmentProgressComponent', () => {
  let component: AssignmentProgressComponent;
  let fixture: ComponentFixture<AssignmentProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
