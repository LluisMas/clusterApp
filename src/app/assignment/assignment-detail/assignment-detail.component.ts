  import { Component, OnInit } from '@angular/core';
  import { DataAssignmentService } from '../data-assignment.service';
  import { Assignment } from '../assignment';
  import { ActivatedRoute } from '@angular/router';
  import { Subject } from '../../subject/subject';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
  import { FormControl, FormGroup } from '@angular/forms';
  import { Submission } from '../../submission/submission';
  import { DataSubmissionService } from '../../submission/data-submission.service';
  import { MatTableDataSource } from '@angular/material';

  export interface Ranking {
    name: string;
    position: number;
    time: number;
  }

  const URL = 'http://localhost:4600/routes/submission/file';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {

  assignment = new Assignment();
  subject = new Subject();
  submissions = [];

  newSubmissionForm: FormGroup;

  displayedColumns: string[] = ['position', 'name', 'time'];
  displayedColumnsSubmissions: string[] = ['date', 'name', 'jobId', 'status'];
  dataSourceSubmissions: MatTableDataSource<Submission>;

  dataSourceRanking = [];

  constructor( private route: ActivatedRoute, private assignmentService: DataAssignmentService, private modalService: NgbModal,
               private submissionService: DataSubmissionService) { }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'text'});

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const user = JSON.parse(localStorage.getItem('current_user'));

    this.assignmentService.getAssignment(id).subscribe(assignment => {
      this.assignment = new Assignment(assignment);
      this.subject = assignment.subject;
    });

    this.assignmentService.getRanking(id).subscribe(ranking => {
      let position = 1;
      const dataSource: Ranking[] = [];

      ranking.forEach(function (row) {
        const time = row[1];
        const data = row[0];

        const rankingRow = {name: data.name, time: time, position: position++};
        dataSource.push(rankingRow);
      });

      this.dataSourceRanking = dataSource;
    });

    this.submissionService.getSubmissionsOfAssignmentFromuUser(id, user._id).subscribe(submissions => {
      const self = this;
      submissions.forEach(function (submission) {
        self.submissions.push(new Submission(submission));
      });

      this.dataSourceSubmissions = new MatTableDataSource(this.submissions);
    });

    this.newSubmissionForm = new FormGroup({
      name : new FormControl('')
    });

    this.uploader.onAfterAddingFile = (file) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }

      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.uploader.clearQueue();
    };
  }

  open(content, id) {
    this.modalService.open(content, {ariaLabelledBy: id})
      .result.then((result) => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('current_user');

      const uo: FileUploaderOptions = {};
      uo.headers = [
        { name: 'Authorization', value : token },
        { name: 'user', value : user},
        {name: 'Assignment', value: this.assignment._id},
        {name: 'Name', value: this.newSubmissionForm.get('name').value}
      ];
      this.uploader.setOptions(uo);
      this.newSubmissionForm.reset();
      this.uploader.uploadAll();
    }, (reason) => {
    });
  }
}
