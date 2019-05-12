  import { Component, OnInit } from '@angular/core';
  import {DataAssignmentService} from '../data-assignment.service';
  import {Assignment} from '../assignment';
  import {ActivatedRoute} from '@angular/router';
  import {Subject} from '../../subject/subject';
  import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
  import {FileUploader, FileUploaderOptions} from 'ng2-file-upload';

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

  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;

  constructor( private route: ActivatedRoute, private assignmentService: DataAssignmentService, private modalService: NgbModal) { }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'text'});

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentService.getAssignment(id).subscribe(assignment => {
      this.assignment = new Assignment(assignment);
      this.subject = assignment.subject;
    });

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');

    const uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value : token }, { name: 'user', value : user}];
    uo.additionalParameter = [{'verga': 'verga'}];
    this.uploader.setOptions(uo);


    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.uploader.clearQueue();
      alert('ok');
    };
  }

  open(content, id) {
    this.modalService.open(content, {ariaLabelledBy: id})
      .result.then((result) => {
      this.uploader.options.headers.push({name: 'Assignment', value: this.assignment._id});
      this.uploader.options.headers.push({name: 'Name', value: 'asd'});
      this.uploader.uploadAll();
    }, (reason) => {
    });
  }
}
