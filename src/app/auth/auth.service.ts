import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, user: any}>('/routes/auth', {email: email, password: password})
      .pipe(
        map(result => {
           localStorage.setItem('access_token', result.user.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public static get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
