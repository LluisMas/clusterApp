import { Component, OnInit } from '@angular/core';
import {DataProvider} from '../user/data-provider.service';
import {User} from '../user/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];

  constructor(private userService: DataProvider) { }

  ngOnInit() {
    return this.userService.getCustomers().subscribe(
      result => {

        this.users = result;
        /*for (let i = 0; i < result.length; i++) {
          console.log(result[i]);*/
        /*for (const key in user) {
          this.users.push(user[key]);
          console.log(key);
          console.log('as');
        }
        */
        // this.users = result.json()[''];
        // console.log(user);
        // this.users = user;
        // console.log(this.users);
      }
    );
  }
}
