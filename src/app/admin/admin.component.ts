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
    this.getAllUsers();
    console.log(this.users);
  }


  private getAllUsers() {
    return this.userService.getCustomers().subscribe(
      user => {
        console.log(user);
        this.users = user;
        console.log(this.users);
      }
    );
  }
}
