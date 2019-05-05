import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-assignment-sidebar',
  templateUrl: './assignment-sidebar.component.html',
  styleUrls: ['./assignment-sidebar.component.css']
})
export class AssignmentSidebarComponent implements OnInit {

  id: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

}
