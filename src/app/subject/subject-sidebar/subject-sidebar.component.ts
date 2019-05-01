import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subject-sidebar',
  templateUrl: './subject-sidebar.component.html',
  styleUrls: ['./subject-sidebar.component.css']
})
export class SubjectSidebarComponent implements OnInit {

  id: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

}
