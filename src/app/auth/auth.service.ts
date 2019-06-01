import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavbarService } from '../navbar/navbar.service';
import {Router} from '@angular/router';


@Injectable()
export class AuthService {

  isLoggedIn = false;
  private URL = 'http://localhost:4600/routes/auth';

  constructor(private http: HttpClient, private navbarService: NavbarService, private router: Router) {
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, user: any}>(this.URL, {email: email, password: password})
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.user.token);
          localStorage.setItem('current_user', JSON.stringify(result.user));
          this.isLoggedIn = result.user.token !== null;
          this.navbarService.updateLoginStatus(true);
          this.navbarService.updateNavAfterAuth();
          this.router.navigate(['home']);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
  }

  public static get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
