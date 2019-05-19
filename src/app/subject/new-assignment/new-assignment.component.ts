import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSubjectService } from '../data-subject.service';
import { Subject } from '../subject';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { Assignment } from '../../assignment/assignment';
import { DataAssignmentService } from '../../assignment/data-assignment.service';
import { FileLikeObject, FileUploader, FileUploaderOptions } from 'ng2-file-upload';

const URL = 'http://localhost:4600/routes/assignments/uploadData';
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
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NewAssignmentComponent implements OnInit {

  subject = new Subject();

  newAssignmentForm: FormGroup;
  submitted: boolean;
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'datafile'});

  cpuamount: FormControl;

  constructor( private route: ActivatedRoute, private subjectService: DataSubjectService, private assignmentService: DataAssignmentService,
               private router: Router) { }

  ngOnInit() {
    this.cpuamount = new FormControl('', [cpuAmountValidator]);

    const id = this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id).subscribe(subject => this.subject = subject);

    this.newAssignmentForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      startDate : new FormControl(moment()),
      endDate   : new FormControl(moment()),
      compilecommand   : new FormControl('', [Validators.required]),
      runcommand   : new FormControl('', [Validators.required]),
      parallelenvironment   : new FormControl('', [Validators.required]),
      cpuamount   : this.cpuamount
    });

    this.uploader.onAfterAddingFile = (file) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }

      file.withCredentials = false;
    };
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

    assignment.parallelenvironment = this.newAssignmentForm.get('parallelenvironment').value;
    assignment.compilecommand = this.newAssignmentForm.get('compilecommand').value;

    assignment.runcommand = this.newAssignmentForm.get('runcommand').value;
    const values = this.newAssignmentForm.get('cpuamount').value.split(',');

    assignment.cpuamount = [];
    values.forEach(function (value) {
      const number = Number(value.trim());
      if (number) {
        assignment.cpuamount.push(number);
      }
    });

    this.assignmentService.createAssignment(assignment)
      .subscribe(res => {
          if (res) {
            const token = localStorage.getItem('access_token');
            const user = localStorage.getItem('current_user');

            const uo: FileUploaderOptions = {};
            uo.headers = [
              { name: 'Authorization', value : token },
              { name: 'user', value : user},
              {name: 'Assignment', value: res._id},
            ];
            this.uploader.setOptions(uo);

            this.uploader.uploadAll();
            this.router.navigate([`subjects/${this.subject._id}`]);
          }
        }, (err) => {
          console.log(err);
        }
      );
  }
}

function cpuAmountValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value === undefined) {
    return { 'required': true };
  }

  const values = control.value.split(',');

  let toReturn = null;
  values.forEach(function (value) {

    if (!Number(value.trim())) {
      toReturn = { 'invalidValues': true };
      return;
    }

    const number = Number(value.trim());

    if (number <= 0) {
      toReturn = { 'minValue' : true};
      return;
    }

    if (number > 32) {
      toReturn = { 'maxValue' : true};
      return;
    }
  });
  return toReturn;
}
