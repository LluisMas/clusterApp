import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Assignment } from '../assignment';
import { ActivatedRoute } from '@angular/router';
import { DataAssignmentService } from '../data-assignment.service';
import { DataSubmissionService } from '../../submission/data-submission.service';

@Component({
  selector: 'app-assignment-progress',
  templateUrl: './assignment-progress.component.html',
  styleUrls: ['./assignment-progress.component.css']
})
export class AssignmentProgressComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Tiempo' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    title: {
      display: true,
      text: '',
      fontSize: 24
    }
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart;

  assignment = new Assignment();
  submissions = [];

  constructor(private route: ActivatedRoute, private assignmentService: DataAssignmentService,
              private submissionService: DataSubmissionService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const user = JSON.parse(localStorage.getItem('current_user'));

    this.assignmentService.getAssignment(id).subscribe(assignment => {
      this.assignment = new Assignment(assignment);
      this.chart.options.title.text = assignment.name + ' - Progreso';
      this.chart.refresh();
    });

    this.submissionService.getSuccessfulSubmissionsOfAssignmentFromuUser(id, user._id).subscribe(submissions => {
      this.submissions = submissions;
      const self = this;
      submissions.forEach(function (submission) {
        const data: number[] = self.lineChartData[0].data as number[];
        data.push(submission.executionTime);

        const date = new Date(submission.submitted.toLocaleString());
        const label = date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
        self.lineChartLabels.push(label);
      });
    });
  }
}
