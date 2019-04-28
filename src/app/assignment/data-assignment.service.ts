import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Assignment} from './assignment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataAssignmentService {

  private assignmentUrl = 'http://localhost:4600/routes/assignments';

  constructor(private http: HttpClient) { }

  getAssignment (): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.assignmentUrl);
  }

  deleteAssignment (id: any): Observable<Assignment> {
    const url = `${this.assignmentUrl}/${id}`;
    return this.http.delete<Assignment>(url, httpOptions);
  }

  updateAssignment (id: any, subject: Assignment): Observable<Assignment> {
    const url = `${this.assignmentUrl}/${id}`;
    return this.http.put<Assignment>(url, subject, httpOptions);
  }

  createAssignment (subject: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(this.assignmentUrl, subject);
  }
}
