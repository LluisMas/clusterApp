import { Component, OnInit } from '@angular/core';
import { Subject } from '../subject';
import {ActivatedRoute} from '@angular/router';
import {DataSubjectService} from '../data-subject.service';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent implements OnInit {

  subject = new Subject();

  constructor( private route: ActivatedRoute, private subjectService: DataSubjectService ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id)
      .subscribe(subject => this.subject = subject);
  }

}
