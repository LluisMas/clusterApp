import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataProvider {

  private usersUrl = `http://${environment.apiHost}:${environment.apiPort}/routes/users`;

  constructor( private http: HttpClient ) { }

  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser (id: any): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url);
  }

  deleteUser (id: any): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, httpOptions);
  }

  updateUser (id: any, user: User): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.put<User>(url, user, httpOptions);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user);
  }

  updatePass(id: any, pass: any) {
    const url = `${this.usersUrl}/${id}/pass`;
    return this.http.post(url, pass);
  }
}
