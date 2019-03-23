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

  getCustomers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
}
