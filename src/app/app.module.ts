import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MainService } from './main.service';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { DataProvider } from './user/data-provider.service';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminSubjectsComponent } from './admin/admin-subjects/admin-subjects.component';
import { AdminAssignmentsComponent } from './admin/admin-assignments/admin-assignments.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SubjectDetailComponent } from './subject/subject-detail/subject-detail.component';
import { SubjectSidebarComponent } from './subject/subject-sidebar/subject-sidebar.component';
import { SubjectStudentsComponent } from './subject/subject-students/subject-students.component';
import { NewAssignmentComponent } from './subject/new-assignment/new-assignment.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail/assignment-detail.component';
import { AssignmentSidebarComponent } from './assignment/assignment-sidebar/assignment-sidebar.component';
import { AssignmentEditComponent } from './assignment/assignment-edit/assignment-edit.component';
import { AdminSubmissionsComponent } from './admin/admin-submissions/admin-submissions.component';
import { SubmissionListComponent } from './assignment/submission-list/submission-list.component';
import { AssignmentProgressComponent } from './assignment/assignment-progress/assignment-progress.component';
import { AssignmentStatisticsComponent } from './assignment/assignment-statistics/assignment-statistics.component';


import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatListModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
  MatTableModule, MatCardModule, MatRadioModule, MatIconModule
  } from '@angular/material';


const Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'posts', component: MainComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'profile', component: UserProfileComponent },

  { path: 'subjects/:id', component: SubjectDetailComponent },
  { path: 'subjects/:id/students', component: SubjectStudentsComponent },
  { path: 'subjects/:id/newAssignment', component: NewAssignmentComponent },

  { path: 'assignments/:id', component: AssignmentDetailComponent },
  { path: 'assignments/:id/edit', component: AssignmentEditComponent },
  { path: 'assignments/:id/submissions', component: SubmissionListComponent },
  { path: 'assignments/:id/progress', component: AssignmentProgressComponent },
  { path: 'assignments/:id/statistics', component: AssignmentStatisticsComponent },

  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/subjects', component: AdminSubjectsComponent },
  { path: 'admin/assignments', component: AdminAssignmentsComponent },
  { path: 'admin/submissions', component: AdminSubmissionsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    AdminUsersComponent,
    FileSelectDirective,
    AdminSubjectsComponent,
    AdminAssignmentsComponent,
    SubjectDetailComponent,
    SubjectSidebarComponent,
    SubjectStudentsComponent,
    NewAssignmentComponent,
    AssignmentDetailComponent,
    AssignmentSidebarComponent,
    AssignmentEditComponent,
    AdminSubmissionsComponent,
    SubmissionListComponent,
    AssignmentProgressComponent,
    UserProfileComponent,
    AssignmentStatisticsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMomentDateModule,
    AngularFontAwesomeModule,
    ChartsModule,
    RouterModule.forRoot(Routes),

    // Material Modules
    MatListModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule,
    MatCardModule, MatRadioModule, MatIconModule
],
  providers: [
    MainService,
    AuthService,
    DataProvider,
    AuthGuard, AuthInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
