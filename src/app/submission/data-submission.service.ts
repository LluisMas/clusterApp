import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from './submission';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataSubmissionService {

  private submissionUrl = 'http://localhost:4600/routes/submission';

  constructor(private http: HttpClient) { }

  getSubmissions (): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.submissionUrl);
  }

  deleteSubmission (id: any): Observable<Submission> {
    const url = `${this.submissionUrl}/${id}`;
    return this.http.delete<Submission>(url, httpOptions);
  }
}
