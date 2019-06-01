  import {Component, OnInit, ViewChild} from '@angular/core';
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
  import { DomSanitizer } from '@angular/platform-browser';
  import { MatIconRegistry } from '@angular/material/icon';

  export interface Ranking {
    name: string;
    position: number;
    time: number;
    change: number;
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
  currentSubmission: Submission;
  submissions = [];

  newSubmissionForm: FormGroup;

  displayedColumns: string[] = ['position', 'name', 'time'];
  displayedColumnsSubmissions: string[] = ['date', 'name', 'jobId', 'status', 'details'];
  dataSourceSubmissions: MatTableDataSource<Submission>;

  currentExecutionDetails = {
    output: '',
    expected: ''
  };

  dataSourceRanking = [];

  @ViewChild('submissionDetails') private detailsPopup;

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
      if (ranking !== null) {
        ranking.forEach(function (row) {
          const time = row[1];
          const data = row[0];
          const change = row[2];

          const rankingRow = {name: data.name, time: time, position: position++, change: change};
          dataSource.push(rankingRow);
        });

        dataSource.push({name: 'alumno1', time: 10, position: position++, change: 0});
        dataSource.push({name: 'alumno2', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno3', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno4', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno5', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno6', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno7', time: 10, position: position++, change: -100});
      }

      this.dataSourceRanking = dataSource;
    });

    this.submissionService.getSubmissionsOfAssignmentFromuUser(id, user._id).subscribe(submissions => {

      if (submissions !== null) {
        const self = this;
        submissions.forEach(function (submission) {
          self.submissions.push(new Submission(submission));
        });
      }

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

  getClass(row) {
    let result = 'mat-row';
    if (row.position === 1) {
      result += ' make-gold';
    } else if (row.position === 2) {
      result += ' make-silver';
    } else if (row.position === 3) {
      result += ' make-bronze';
    }

    return result;
  }

  openDetails(id) {
    const self = this;

    this.submissions.forEach(function (submission) {
      if (submission._id === id) {
        self.currentSubmission = submission;
        self.onTestClick(0);
      }
    });

    this.open(this.detailsPopup, 'modal-details-title');
  }

  onTestClick(id) {
    this.currentExecutionDetails.output = this.currentSubmission.outputs[id];

    const index = Math.floor(id / this.assignment.cpuamount.length);
    console.log(index);
    this.currentExecutionDetails.expected = this.assignment.runcommand[index]['expected'];
  }

  open(content, id) {
    this.modalService.open(content, {
      ariaLabelledBy: id,
      windowClass: 'hugeModal',
      backdrop: 'static',
      size: 'lg'
      })
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
