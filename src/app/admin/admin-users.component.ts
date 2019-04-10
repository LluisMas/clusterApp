import {Component, OnInit} from '@angular/core';
import {User} from '../user/user';
import {DataProvider} from '../user/data-provider.service';
import {Observable} from 'rxjs';
import {tsStructureIsReused} from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: User[];
  editField: string;

  constructor(private userService: DataProvider) { }

  ngOnInit() {
    // this.service.createTableWithIds(this.tableHeaders, this.tableRowsWithId, this.dataType);

    return this.userService.getUser().subscribe(
      result => {
        this.users = result;
        console.log(result);
      }
    );
  }

  updateList(id: string, property: string, event: any) {
    const user: User = this.getUserFromId(id);
    user[property] = event.target.textContent;
  }

  remove(id: any) {
    console.log('gonna delete' + id);
    this.userService.deleteUser(id)
      .subscribe(() => {
          console.log('user ' + id + ' deleted');
          this.users.splice(id, 1);
        }
      );
  }

  add() {

  }

  changeValue(id: string, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  save(id: string) {

    const user: User = this.getUserFromId(id);
    console.log(user);
    this.userService.updateUser(id, user)
      .subscribe(res => {
          console.log('user ' + id + 'updated');
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
}
