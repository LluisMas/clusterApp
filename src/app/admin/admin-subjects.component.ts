import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from '../subject/subject';
import { DataSubjectService } from '../subject/data-subject.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user/user';
import { DataProvider } from '../user/data-provider.service';
import { map, startWith } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css']
})
export class AdminSubjectsComponent implements OnInit {

  subjects: Subject[];
  users: User[];
  editField: string;

  registerForm: FormGroup;
  submitted = false;
  selectedFile: File = null;

  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  currentProfessor: User = null;
  currentStudents: any;

  correct: any;
  incorrect: any;

  @ViewChild('responsePopup') private responsePopup;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.users.slice())
      );

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      year: ['', Validators.required],
      profesor: ['', this.validateProfessor()]
    });

    this.dataService.getSubject().subscribe(
      result => {
        this.subjects = result;
      }
    );

    this.userService.getUser().subscribe(
      result => {
        this.users = result.filter( function (user) { return user.role === 'Profesor'; });
      }
    );
  }

  constructor(private dataService: DataSubjectService, private userService: DataProvider,
              private modalService: NgbModal, private formBuilder: FormBuilder) { }

  private validateProfessor() {
    return this.currentProfessor;
  }

  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0 && option.role === 'Profesor');
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const subject = new Subject();
    subject.name = this.registerForm.get('name').value;
    subject.year = this.registerForm.get('year').value;
    subject.professor = this.currentProfessor;
    subject.students = [];

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      fileReader.result.split('\n').forEach((user) => {
          if (user.length) {
            subject.students.push(user);
          }
      });

      this.dataService.createSubject(subject)
        .subscribe(res => {
          this.openModal(this.responsePopup, 'modal-response');
            this.subjects.push(res['subject']);
            this.correct = res['correct'];
            this.incorrect = res['incorrect'];
          }, (err) => {
            console.log(err);
          }
        );
    };

    if (this.selectedFile !== null) {
      fileReader.readAsText(this.selectedFile);
    } else {
      this.dataService.createSubject(subject)
        .subscribe(res => {
          this.subjects.push(res['subject']);
          }, (err) => {
            console.log(err);
          }
        );
    }

    this.modalService.dismissAll();
  }

  changeValue(id: string, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  updateList(id: string, property: string, event: any) {
    const subject: Subject = this.getSubjectFromId(id);
    subject[property] = event.target.textContent;
  }

  remove(id: any) {
    this.dataService.deleteSubject(id)
      .subscribe(() => {
          this.subjects.forEach((item, index) => {
            if (item._id === id) {
              this.subjects.splice(index, 1);
              console.log('subject ' + id + ' deleted');
            }
          });
        }
      );
  }

  save(id: string) {

    const subject: Subject = this.getSubjectFromId(id);
    console.log('updating ' + subject);

    this.dataService.updateSubject(id, subject)
      .subscribe(res => {
          console.log('subject ' + id + ' updated');
        }, (err) => {
          console.log(err);
        }
      );
  }

  getSubjectFromId (id: string) {

    let result: Subject = null;
    this.subjects.forEach(function(subject) {
      if (subject._id === id) {
        result = subject;
        return;
      }
    });
    return result;
  }

  openModal(content, id) {
    this.modalService.open(content, {ariaLabelledBy: id}).result.
    then((result) => {
      this.registerForm.reset();
      this.submitted = false;
      this.selectedFile = null;
      this.currentProfessor = null;
    }, (reason) => {
      this.registerForm.reset();
      this.selectedFile = null;
      this.currentProfessor = null;
      this.submitted = false;
    });
  }

  getProfessor(value: any) {
    this.currentProfessor = value ? value : null;
  }

  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
  }

  openStudentsModal(content, id: any) {
    this.dataService.getStudentsSubject(id).subscribe(
      result => {
        this.currentStudents = result;
        this.openModal(content, 'modal-students');
      }
    );
  }
}
