import { Component, OnInit } from '@angular/core';
import {Assignment} from '../assignment';
import {ActivatedRoute, Router} from '@angular/router';
import {DataAssignmentService} from '../data-assignment.service';
import {Subject} from '../../subject/subject';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from '../../subject/new-assignment/new-assignment.component';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-assignment-edit',
  templateUrl: './assignment-edit.component.html',
  styleUrls: ['./assignment-edit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AssignmentEditComponent implements OnInit {

  assignment = new Assignment();
  subject = new Subject();

  newAssignmentForm: FormGroup;
  submitted: boolean;

  constructor( private route: ActivatedRoute, private assignmentService: DataAssignmentService, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentService.getAssignment(id).subscribe(assignment => {
      this.assignment = assignment;
      this.subject = assignment.subject;

      this.newAssignmentForm.controls['name'].setValue(assignment.name);
      this.newAssignmentForm.controls['startDate'].setValue(assignment.startDate);
      this.newAssignmentForm.controls['endDate'].setValue(assignment.endDate);
    });

    this.newAssignmentForm = new FormGroup({
      name : new FormControl(this.assignment.name, [Validators.required]),
      startDate : new FormControl(moment()),
      endDate   : new FormControl(moment())
    });
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

    this.assignmentService.updateAssignment(this.assignment._id, assignment)
      .subscribe(res => {
          if (res) {
            this.router.navigate([`assignments/${this.assignment._id}`]);
          }
        }, (err) => {
          console.log(err);
        }
      );
  }

  hasError(controlName: string, errorName: string) {
    return this.newAssignmentForm.controls[controlName].hasError(errorName);
  }
}
