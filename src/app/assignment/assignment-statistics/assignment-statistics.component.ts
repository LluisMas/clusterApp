import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataAssignmentService } from '../data-assignment.service';
import { Assignment } from '../assignment';
import { MatTableDataSource } from '@angular/material';

export interface StatisticsElement {
  name: string;
  total: number;
  correct: number;
  incorrect: number;
  waiting: number;
}

@Component({
  selector: 'app-assignment-statistics',
  templateUrl: './assignment-statistics.component.html',
  styleUrls: ['./assignment-statistics.component.css']
})
export class AssignmentStatisticsComponent implements OnInit {

  assignment = new Assignment();

  dataSource: MatTableDataSource<StatisticsElement>;
  displayedColumns: string[] = ['name', 'total', 'correct', 'incorrect', 'waiting'];

  constructor(private route: ActivatedRoute, private assignmentService: DataAssignmentService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentService.getAssignment(id).subscribe(assignment => this.assignment = assignment);
    this.assignmentService.getStatistics(id).subscribe( statistics => {
        console.log(statistics);
        this.dataSource = new MatTableDataSource(statistics);
      });
  }
}
