import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataSubjectService} from '../data-subject.service';
import {Subject} from '../subject';
import {User} from '../../user/user';
import {MatTableDataSource} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataProvider} from '../../user/data-provider.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-subject-students',
  templateUrl: './subject-students.component.html',
  styleUrls: ['./subject-students.component.css']
})
export class SubjectStudentsComponent implements OnInit {

  subject = new Subject();
  dataSource: MatTableDataSource<User>;
  students = [];
  users: User[];
  displayedColumns: string[] = ['name', 'email', 'dni', 'role'];
  displayedColumnsStudent: string[] = ['name', 'email', 'role'];
  currentUser: User;

  registerForm: FormGroup;
  submitted: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  currentStudent: User;

  constructor( private route: ActivatedRoute, private subjectService: DataSubjectService,
               private modalService: NgbModal, private formBuilder: FormBuilder, private userService: DataProvider) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('current_user'));
    const id = this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id)
      .subscribe(result => {
        this.subject = result;

        const self = this;
        result.students.forEach(function (student) {
          self.students.push(new User(student));
        });

        console.log(this.students);
        let temp = this.students.filter(function(student) {return student !== null; });
        this.dataSource = new MatTableDataSource(temp);
      });

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.userService.getUser().subscribe(
      result => {
        this.users = result.filter( function (user) { return user.role === 'Estudiante'; });
      }
    );

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );
  }

  onSubmitAddExistingUser() {
    this.submitted = true;

    this.subjectService.addStudentToSubject(this.subject._id, this.currentStudent)
      .subscribe(res => {
        this.students.push(res);
      });
    this.modalService.dismissAll();
  }

  displayFn(subject?: Subject): string | undefined {
    return subject ? subject.name : undefined;
  }

  openModal(content, id) {
    this.modalService.open(content, {ariaLabelledBy: id}).result.
    then((result) => {
      this.registerForm.reset();
      this.submitted = false;
    }, (reason) => {
      this.registerForm.reset();
      this.submitted = false;
    });
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0 && option.role === 'Estudiante');
  }

  getStudent(value: any) {
    this.currentStudent = value ? value : null;
  }
}
