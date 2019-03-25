import { Component, OnInit } from '@angular/core';
import { User } from '../user/user';
import { DataProvider } from '../user/data-provider.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: User[];

  constructor(private userService: DataProvider) { }

  ngOnInit() {
    return this.userService.getCustomers().subscribe(
      result => {
        console.log('asdasd');
        this.users = result;
      }
    );
  }

}
