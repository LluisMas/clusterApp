import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { User } from '../user';
import { DataProvider } from '../data-provider.service';
import { Router } from '@angular/router';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  hide = true;
  newPassForm: any;
  submitted: boolean;
  passwordsMatcher = new RepeatPasswordEStateMatcher;

  user: User;

  constructor(private userService: DataProvider, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('current_user'));

    this.newPassForm = this.formBuilder.group({
      pass      : new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeat : new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });
  }

  hasError(controlName: string, errorName: string) {
    return this.newPassForm.controls[controlName].hasError(errorName);
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.pass.value;
    const confirmPass = group.controls.repeat.value;

    return pass === confirmPass ? null : { notSame: true };
  }


  onSubmit() {
    this.submitted = true;

    if (this.newPassForm.invalid) {
      return;
    }

    this.userService.updatePass(this.user._id, {pass: this.newPassForm.get('pass').value }).subscribe(result => {
      console.log(result);
      this.router.navigate(['login']);
    });
  }
}

export class RepeatPasswordEStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.parent.get('pass').value !== control.parent.get('repeat').value && control.dirty);
  }
}
