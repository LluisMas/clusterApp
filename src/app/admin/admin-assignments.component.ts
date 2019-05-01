import { Component, OnInit } from '@angular/core';
import {DataAssignmentService} from '../assignment/data-assignment.service';
import { Assignment } from '../assignment/assignment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DataSubjectService} from '../subject/data-subject.service';
import {Subject} from '../subject/subject';
import {map, startWith} from 'rxjs/operators';
import {User} from '../user/user';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-admin-assignments',
  templateUrl: './admin-assignments.component.html',
  styleUrls: ['./admin-assignments.component.css']
})
export class AdminAssignmentsComponent implements OnInit {

  assignments: Assignment[];
  subjects: Subject[];
  filteredOptions: Observable<Subject[]>;

  registerForm: FormGroup;
  submitted: boolean;

  currentEndDate: any = null;
  currentStartDate: any = null;
  currentSubject: any = null;

  myControl = new FormControl();

  constructor(private assignmentService: DataAssignmentService, private subjectService: DataSubjectService,
              private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | Subject>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.subjects.slice())
      );

    this.assignmentService.getAssignment().subscribe(
      result => {
        this.assignments = result;
      }
    );

    this.subjectService.getSubjects().subscribe(
      result => {
        this.subjects = result;
      }
    );

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  private _filter(name: string): Subject[] {
    const filterValue = name.toLowerCase();
    return this.subjects.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(subject?: Subject): string | undefined {
    return subject ? subject.name : undefined;
  }

  updateList(id: string, property: string, event: any) {
    const assignment: Assignment = this.getAssignmentFromId(id);
    assignment[property] = event.target.textContent;
  }

  onChangeDate(type: string, event: MatDatepickerInputEvent<Date>, id: string) {

    const assignment: Assignment = this.getAssignmentFromId(id);
    assignment[type] = event.value;
  }

  save(id: string) {

    const assignment: Assignment = this.getAssignmentFromId(id);

    this.assignmentService.updateAssignment(id, assignment)
      .subscribe(res => {
          console.log('assignment ' + id + ' updated');
        }, (err) => {
          console.log(err);
        }
      );
  }

  remove(id: any) {
    this.assignmentService.deleteAssignment(id)
      .subscribe(() => {
          this.assignments.forEach((item, index) => {
            if (item._id === id) {
              this.assignments.splice(index, 1);
              console.log('assignment ' + id + ' deleted');
            }
          });
        }
      );
  }

  openModal(content, id) {
    this.modalService.open(content, {ariaLabelledBy: id}).result.
    then((result) => {
      this.registerForm.reset();
      this.submitted = false;
      this.currentStartDate = null;
      this.currentEndDate = null;
      this.currentSubject = null;
    }, (reason) => {
      this.registerForm.reset();
      this.submitted = false;
      this.currentStartDate = null;
      this.currentEndDate = null;
      this.currentSubject = null;
    });
  }

  getAssignmentFromId (id: string) {

    let result: Assignment = null;
    this.assignments.forEach(function(assignment) {
      if (assignment._id === id) {
        result = assignment;
        return;
      }
    });
    return result;
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const assignment = new Assignment();
    assignment.name = this.registerForm.get('name').value;
    assignment.subject = this.currentSubject;
    assignment.startDate = this.currentStartDate;
    assignment.endDate = this.currentEndDate;

    this.assignmentService.createAssignment(assignment)
      .subscribe(res => {
          if (res) {
            res['subject'] = assignment.subject;
            this.assignments.push(res);
          }

        }, (err) => {
          console.log(err);
        }
      );

    this.modalService.dismissAll();
  }

  getEndDate(event: MatDatepickerInputEvent<Date>) {
    this.currentEndDate = event.value ? event.value : null;
  }

  getStartDate(event: MatDatepickerInputEvent<Date>) {
    this.currentStartDate = event.value ? event.value : null;
  }

  getSubject(value: any) {
    this.currentSubject = value ? value : null;
  }
}
