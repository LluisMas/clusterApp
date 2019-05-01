import { Component, OnInit } from '@angular/core';
import { Subject } from '../subject';
import { ActivatedRoute } from '@angular/router';
import { DataSubjectService } from '../data-subject.service';
import { Assignment } from '../../assignment/assignment';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent implements OnInit {

  subject = new Subject();
  assignments = [];
  dataSource: MatTableDataSource<Assignment>;
  displayedColumns: string[] = ['name', 'subject', 'starts', 'ends', 'state'];


  constructor( private route: ActivatedRoute, private subjectService: DataSubjectService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subjectService.getSubject(id)
      .subscribe(subject => this.subject = subject);
    this.subjectService.getAssigmentsSubject(id)
      .subscribe(result => {
        const self = this;
        result.forEach(function (assignment) {
          self.assignments.push(new Assignment(assignment));
        });

        this.dataSource = new MatTableDataSource(this.assignments);
        console.log(this.assignments);
      });


  }

}
