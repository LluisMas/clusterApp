import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { User } from '../user/user';
import { DataProvider } from '../user/data-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FormControl, FormGroup} from '@angular/forms';


const URL = 'http://localhost:4600/routes/users/file';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;


  users: User[];
  editField: string;
  submitFile = new FormGroup({
    file: new FormControl('')
  });

  constructor(private userService: DataProvider, private modalService: NgbModal) { }

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'text'});

  ngOnInit() {
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

    return this.userService.getUser().subscribe(
      result => {
        this.users = result;
      }
    );
  }

  updateList(id: string, property: string, event: any) {
    const user: User = this.getUserFromId(id);
    user[property] = event.target.textContent;
  }

  remove(id: any) {
    this.userService.deleteUser(id)
      .subscribe(() => {
          console.log('user ' + id + ' deleted');
          this.users.splice(id, 1);
        }
      );
  }

  add() {
    const user: User = new User();
    user.dni = 'DNI';
    user.email = 'alumno@email.com';

    this.userService.createUser(user)
      .subscribe(res => {
          console.log('user created');
        }, (err) => {
          console.log(err);
        }
      );
    this.users.push(user);
  }

  changeValue(id: string, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  save(id: string) {

    const user: User = this.getUserFromId(id);
    this.userService.updateUser(id, user)
      .subscribe(res => {
          console.log('user ' + id + ' updated');
        }, (err) => {
          console.log(err);
        }
      );
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
}
