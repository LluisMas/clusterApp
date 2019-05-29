import { Component, OnInit } from '@angular/core';
import { Submission } from '../../submission/submission';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataSubmissionService } from '../../submission/data-submission.service';
import { Assignment } from '../assignment';
import { DataAssignmentService } from '../data-assignment.service';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit {

  assignment = new Assignment();
  dataSource: MatTableDataSource<Submission>;
  submissions = [];

  displayedColumns: string[] = ['name', 'status', 'author', 'jobId', 'time', 'originalName'];

  constructor(private route: ActivatedRoute, private submissionService: DataSubmissionService,
              private assignmentService: DataAssignmentService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentService.getAssignment(id).subscribe(assignment => this.assignment = assignment);
    this.assignmentService.getSubmissionAssignment(id).subscribe(submissions => {
      const self = this;
      submissions.forEach(function (submission) {
        self.submissions.push(new Submission(submission));
      });

      this.dataSource = new MatTableDataSource(this.submissions);
    });
  }

  average(arr: any) {
    let sum, avg = 0;

    if (arr.length) {
      sum = arr.reduce(function(a, b) { return a + b; });
      avg = sum / arr.length;
    } else {
      return 0;
    }

    return avg;
  }
}
