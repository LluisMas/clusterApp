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

  export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
  }

  const URL = 'http://localhost:4600/routes/submission/file';

  const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079},
    {position: 2, name: 'Helium', weight: 4.0026},
    {position: 3, name: 'Lithium', weight: 6.941},
    {position: 4, name: 'Beryllium', weight: 9.0122},
    {position: 5, name: 'Boron', weight: 10.811},
    {position: 6, name: 'Carbon', weight: 12.0107},
    {position: 7, name: 'Nitrogen', weight: 14.0067},
    {position: 8, name: 'Oxygen', weight: 15.9994},
    {position: 9, name: 'Fluorine', weight: 18.9984},
    {position: 10, name: 'Neon', weight: 20.1797},
  ];

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {

  assignment = new Assignment();
  subject = new Subject();
  submissions: Submission[];

  newSubmissionForm: FormGroup;

  displayedColumns: string[] = ['position', 'name', 'weight'];
  displayedColumnsSubmissions: string[] = ['date', 'name', 'jobId', 'status'];
  dataSourceSubmissions: MatTableDataSource<Submission>;

  dataSource = ELEMENT_DATA;

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

    this.submissionService.getSubmissionsOfAssignmentFromuUser(id, user._id).subscribe(submissions => {
      this.submissions = submissions;
      this.dataSourceSubmissions = new MatTableDataSource(submissions);
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
