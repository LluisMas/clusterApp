import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from './submission';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataSubmissionService {

  private submissionUrl = `http://${environment.apiHost}:${environment.apiPort}/routes/submission`;

  constructor(private http: HttpClient) { }

  getSubmissions (): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.submissionUrl);
  }

  getSubmission (id: any): Observable<Submission> {
    const url = `${this.submissionUrl}/${id}`;
    return this.http.get<Submission>(url);
  }

  deleteSubmission (id: any): Observable<Submission> {
    const url = `${this.submissionUrl}/${id}`;
    return this.http.delete<Submission>(url, httpOptions);
  }

  getSubmissionsOfAssignmentFromuUser(assignmentid: any, userid: any): Observable<Submission[]> {
    const url = `${this.submissionUrl}/${assignmentid}/author/${userid}`;
    return this.http.get<Submission[]>(url);
  }

  getSuccessfulSubmissionsOfAssignmentFromuUser(assignmentid: any, userid: any): Observable<Submission[]> {
    const url = `${this.submissionUrl}/${assignmentid}/author/${userid}/successful`;
    return this.http.get<Submission[]>(url);
  }

  getSuccessfulSubmissionsFromuUser(userid: any) {
    const url = `${this.submissionUrl}/${userid}/successful`;
    return this.http.get(url);
  }
}
