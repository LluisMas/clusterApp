import { Component, OnInit } from '@angular/core';
import { Submission } from '../../submission/submission';
import { DataSubmissionService } from '../../submission/data-submission.service';

@Component({
  selector: 'app-admin-submissions',
  templateUrl: './admin-submissions.component.html',
  styleUrls: ['./admin-submissions.component.css']
})
export class AdminSubmissionsComponent implements OnInit {

  submissions: Submission[];

  constructor(private submissionService: DataSubmissionService) { }

  ngOnInit() {
    this.submissionService.getSubmissions().subscribe(
      result => {
        this.submissions = result;
      }
    );
  }

  remove(id: any) {
    this.submissionService.deleteSubmission(id)
      .subscribe(() => {
          this.submissions.forEach((item, index) => {
            if (item._id === id) {
              this.submissions.splice(index, 1);
              console.log('submission ' + id + ' deleted');
            }
          });
        }
      );
  }
}
