import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from './assignment';
import { Submission } from '../submission/submission';
import { StatisticsElement } from './assignment-statistics/assignment-statistics.component';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataAssignmentService {

  private assignmentUrl = `http://${environment.apiHost}:${environment.apiPort}/routes/assignments`;

  constructor(private http: HttpClient) { }

  getAssignment (id: any): Observable<Assignment> {
    const url = `${this.assignmentUrl}/${id}`;
    return this.http.get<Assignment>(url, httpOptions);
  }

  getAssignments (): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.assignmentUrl);
  }

  getRanking (id: any): Observable<any[]> {
    const url = `${this.assignmentUrl}/${id}/ranking`;
    return this.http.get<any[]>(url);
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

  getSubmissionAssignment(id: any): Observable<Submission[]> {
    const url = `${this.assignmentUrl}/${id}/submissions`;
    return this.http.get<Submission[]>(url);
  }

  getStatistics(id: any): Observable<StatisticsElement[]> {
    const url = `${this.assignmentUrl}/${id}/statistics`;
    return this.http.get<StatisticsElement[]>(url);
  }
}
