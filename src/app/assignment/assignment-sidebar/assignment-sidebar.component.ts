import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DataAssignmentService } from '../data-assignment.service';
import {Assignment} from '../assignment';
import {User} from '../../user/user';

@Component({
  selector: 'app-assignment-sidebar',
  templateUrl: './assignment-sidebar.component.html',
  styleUrls: ['./assignment-sidebar.component.css']
})
export class AssignmentSidebarComponent implements OnInit {

  assignment = new Assignment();
  currentUser: User;

  constructor(private route: ActivatedRoute, private assignmentService: DataAssignmentService, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentUser = JSON.parse(localStorage.getItem('current_user'));
    this.assignmentService.getAssignment(id).subscribe(assignment => {
      this.assignment = assignment;
    });
  }

  deleteSubject() {
    if (confirm('¿Está seguro que desea eliminar la actividad?')) {
      this.assignmentService.deleteAssignment(this.assignment._id)
        .subscribe(() => {
          this.router.navigate([`subjects/${this.assignment.subject._id}`]);
        });
    }
  }
}
