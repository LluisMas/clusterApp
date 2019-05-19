import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {NavbarService} from '../navbar/navbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;
  public error: string;

  constructor(private auth: AuthService, private router: Router, private navbar: NavbarService) { }

  public submit() {
    this.auth.login(this.email, this.password)
      .pipe(first())
      .subscribe(
        result => {
          this.router.navigate(['home']);
          this.navbar.show();
        },
        err => {
          console.log(err.error.errors);
          this.error = 'Could not authenticate';
        }
      );
  }

  ngOnInit(): void {
    this.navbar.hide();
  }
}
