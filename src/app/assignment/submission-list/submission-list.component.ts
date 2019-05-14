import { Component, OnInit } from '@angular/core';
import { Submission } from '../../submission/submission';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataSubmissionService } from '../../submission/data-submission.service';
import { Assignment } from '../assignment';
import {DataAssignmentService} from '../data-assignment.service';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit {

  assignment = new Assignment();
  dataSource: MatTableDataSource<Submission>;
  submissions: Submission[];

  displayedColumns: string[] = ['name', 'status', 'author', 'jobId', 'originalName'];

  constructor(private route: ActivatedRoute, private submissionService: DataSubmissionService,
              private assignmentService: DataAssignmentService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentService.getAssignment(id).subscribe(assignment => this.assignment = assignment);
    this.assignmentService.getSubmissionAssignment(id).subscribe(submissions => {
      this.submissions = submissions;
      this.dataSource = new MatTableDataSource(this.submissions);
    });
  }
}
