import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject} from './subject';
import {User} from '../user/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataSubjectService {

  private subjectsUrl = 'http://localhost:4600/routes/subjects';

  constructor( private http: HttpClient ) { }

  getSubject (): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectsUrl);
  }

  deleteSubject (id: any): Observable<Subject> {
    const url = `${this.subjectsUrl}/${id}`;
    return this.http.delete<Subject>(url, httpOptions);
  }

  updateSubject (id: any, subject: Subject): Observable<Subject> {
    const url = `${this.subjectsUrl}/${id}`;
    return this.http.put<Subject>(url, subject, httpOptions);
  }

  createSubject(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(this.subjectsUrl, subject);
  }

  getStudentsSubject(id: any): Observable<User[]> {
    const url = `${this.subjectsUrl}/${id}/students`;
    return this.http.get<User[]>(url);
  }
}
