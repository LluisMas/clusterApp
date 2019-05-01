import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {User} from '../../user/user';

@Component({
  selector: 'app-subject-sidebar',
  templateUrl: './subject-sidebar.component.html',
  styleUrls: ['./subject-sidebar.component.css']
})
export class SubjectSidebarComponent implements OnInit {

  id: string;
  currentUser: User;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.currentUser = JSON.parse(localStorage.getItem('current_user'));
  }

}
