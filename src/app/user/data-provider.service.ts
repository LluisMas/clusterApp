import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataProvider {

  private usersUrl = 'http://localhost:4600/routes/users';

  constructor( private http: HttpClient ) { }

  getUser (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  deleteUser (id: any): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, httpOptions);
  }

  updateUser (id: any, user: User): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.put<User>(url, user, httpOptions);
  }
}
