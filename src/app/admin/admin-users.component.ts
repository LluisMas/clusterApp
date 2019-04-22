import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { User } from '../user/user';
import { DataProvider } from '../user/data-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FileUploader, FileUploaderOptions} from 'ng2-file-upload/ng2-file-upload';
import { FormControl, FormGroup} from '@angular/forms';
import {Role} from '../user/roles';

const URL = 'http://localhost:4600/routes/users/file';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  currentUser: User;

  users: User[];
  editField: string;
  submitFile = new FormGroup({
    file: new FormControl('')
  });

  roles: Role[] = [
    {id: 1, name: 'Profesor'},
    {id: 2, name: 'Estudiante'}
  ];

  constructor(private dataService: DataProvider, private modalService: NgbModal) { }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'text'});

  ngOnInit() {

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');

    const uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value : token }, { name: 'user', value : user}];
    this.uploader.setOptions(uo);

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const obj = JSON.parse(response);
      this.submitFile.reset();
      this.uploader.clearQueue();

      for (const entry of obj['users']) {
        this.users.push(entry);
      }
      alert(obj['success']);
    };

    console.log(localStorage.getItem('current_user'));
    this.currentUser = JSON.parse(localStorage.getItem('current_user'));

    return this.dataService.getUser().subscribe(
      result => {
        this.users = result;
      }
    );
  }

  updateList(id: string, property: string, event: any) {
    const user: User = this.getUserFromId(id);
    user[property] = event.target.textContent;
  }

  updateRoles(id: string, event: any) {
    const user: User = this.getUserFromId(id);
    user['role'] = this.roles[event.target.value - 1].name;

    console.log(user);
  }

  remove(id: any) {
    this.dataService.deleteUser(id)
      .subscribe(() => {
          this.users.forEach((item, index) => {
              if (item._id === id) {
                this.users.splice(index, 1);
                console.log('user ' + id + ' deleted');
              }
          });
        }
      );
  }

  add() {
    const user: User = new User();
    user.dni = 'DNI';
    user.email = 'alumno@email.com';
    user.name = 'NUEVO ALUMNO';
    user.role = 'Estudiante';
    this.users.push(user);
  }

  changeValue(id: string, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  save(id: string) {

    const user: User = this.getUserFromId(id);

    if (user._id) {
      this.dataService.updateUser(id, user)
        .subscribe(res => {
            console.log('user ' + id + ' updated');
          }, (err) => {
            console.log(err);
          }
        );
    } else {
      this.dataService.createUser(user)
        .subscribe(res => {
            console.log('user created');
          }, (err) => {
            console.log(err);
          }
        );
    }

  }

  getUserFromId (id: string) {

    let result: User = null;
    this.users.forEach(function(user) {
      if (user._id === id) {
        result = user;
        return;
      }
    });
    return result;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
      this.uploader.uploadAll();
    }, (reason) => {
    });
  }

  filterRoles(name: any) {
    return this.roles.filter((role) => role.name !== name);
  }
}
