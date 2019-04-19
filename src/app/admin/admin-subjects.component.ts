import { Component, OnInit } from '@angular/core';
import { Subject } from '../subject/subject';
import {DataSubjectService} from '../subject/data-subject.service';
import {User} from '../user/user';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css']
})
export class AdminSubjectsComponent implements OnInit {

  subjects: Subject[];
  editField: string;

  constructor(private dataService: DataSubjectService) { }

  ngOnInit() {
    return this.dataService.getSubject().subscribe(
      result => {
        this.subjects = result;
      }
    );
  }

  changeValue(id: string, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  updateList(id: string, property: string, event: any) {
    const subject: Subject = this.getSubjectFromId(id);
    subject[property] = event.target.textContent;
  }

  remove(id: any) {
    this.dataService.deleteSubject(id)
      .subscribe(() => {
          this.subjects.forEach((item, index) => {
            if (item._id === id) {
              this.subjects.splice(index, 1);
              console.log('subject ' + id + ' deleted');
            }
          });
        }
      );
  }

  save(id: string) {

    const subject: Subject = this.getSubjectFromId(id);
    console.log('updating ' + subject);

    this.dataService.updateSubject(id, subject)
      .subscribe(res => {
          console.log('subject ' + id + ' updated');
        }, (err) => {
          console.log(err);
        }
      );
  }

  getSubjectFromId (id: string) {

    let result: Subject = null;
    this.subjects.forEach(function(subject) {
      if (subject._id === id) {
        result = subject;
        return;
      }
    });
    return result;
  }
}
