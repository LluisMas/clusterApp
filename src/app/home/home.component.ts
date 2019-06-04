import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarService } from '../navbar/navbar.service';
import { DataSubmissionService } from '../submission/data-submission.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {Ranking} from '../assignment/assignment-detail/assignment-detail.component';
import {DataAssignmentService} from '../assignment/data-assignment.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private navbar: NavbarService, private submissionService: DataSubmissionService,
              private assignmentService: DataAssignmentService) { }

  public data = [];
  public labels = [];
  public options = [];
  public rankings = [];
  public dataSourceRanking = {};
  displayedColumns: string[] = ['position', 'name', 'time'];

  public lineChartColors: Color[] = [{
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];

  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart;

  ngOnInit() {
    this.navbar.show();
    const user = JSON.parse(localStorage.getItem('current_user'));

    this.submissionService.getSuccessfulSubmissionsFromuUser(user._id).subscribe(submissions => {

      const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

      for (const key in submissions) {

        this.rankings.push(key);
        this.getRanking(key);
        const assignSubs = submissions[key];

        const assignmentChartData: ChartDataSets[] = [
          { data: [], label: 'Tiempo'}
        ];

        const chartLabels: Label[] = [];

        const lineChartOptions: (ChartOptions) = {
          responsive: true,
          scales: { xAxes: [{}], yAxes: [ {id: 'y-axis-0', position: 'left'} ] },
          title: { display: true, text: assignSubs[0], fontSize: 24 }
        };

        if (assignSubs.length > 1) {

          assignSubs.slice(1).forEach(function (submission) {
            const d: number[] = assignmentChartData[0].data as number[];
            d.push(average(submission.executionTime));
            const date = new Date(submission.submitted.toLocaleString());
            const label = date.getMonth() + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
            chartLabels.push(label);
          });
        }

        this.data.push(assignmentChartData);
        this.labels.push(chartLabels);
        this.options.push(lineChartOptions);
      }
    });
  }

  private getRanking(id: string) {
    this.assignmentService.getRanking(id).subscribe(ranking => {
      let position = 1;
      const dataSource: Ranking[] = [];
      if (ranking !== null) {
        ranking.forEach(function (row) {
          const time = row[1];
          const data = row[0];
          const change = row[2];

          const rankingRow = {name: data.name, time: time, position: position++, change: change};
          dataSource.push(rankingRow);
        });

        dataSource.push({name: 'alumno1', time: 10, position: position++, change: 0});
        dataSource.push({name: 'alumno2', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno3', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno4', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno5', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno6', time: 10, position: position++, change: -100});
        dataSource.push({name: 'alumno7', time: 10, position: position++, change: -100});
      }

      this.dataSourceRanking[id] = dataSource.slice(0, 6);
    });
  }

}
