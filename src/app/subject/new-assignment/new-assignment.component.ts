import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSubjectService} from '../data-subject.service';
import {Subject} from '../subject';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {Assignment} from '../../assignment/assignment';
import {DataAssignmentService} from '../../assignment/data-assignment.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-new-assignment',
  templateUrl: './new-assignment.component.html',
  styleUrls: ['./new-assignment.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NewAssignmentComponent implements OnInit {

  subject = new Subject();

  newAssignmentForm: FormGroup;
  submitted: boolean;

  constructor( private route: ActivatedRoute, private subjectService: DataSubjectService, private assignmentService: DataAssignmentService,
               private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id).subscribe(subject => this.subject = subject);

    this.newAssignmentForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      startDate : new FormControl(moment()),
      endDate   : new FormControl(moment())
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.newAssignmentForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    this.submitted = true;

    if (this.newAssignmentForm.invalid) {
      return;
    }

    const assignment = new Assignment();
    assignment.name = this.newAssignmentForm.get('name').value;
    assignment.subject = this.subject;
    assignment.startDate = this.newAssignmentForm.get('startDate').value._d;
    assignment.endDate = this.newAssignmentForm.get('endDate').value._d;

    this.assignmentService.createAssignment(assignment)
      .subscribe(res => {
          if (res) {
            this.router.navigate([`subjects/${this.subject._id}`]);
          }
        }, (err) => {
          console.log(err);
        }
      );
  }

}