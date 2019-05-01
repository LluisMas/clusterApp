import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MainService } from './main.service';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { DataProvider } from './user/data-provider.service';
import { AdminUsersComponent } from './admin/admin-users.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminSubjectsComponent } from './admin/admin-subjects.component';
import { AdminAssignmentsComponent } from './admin/admin-assignments.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatListModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
  MatTableModule
  } from '@angular/material';


import { SubjectDetailComponent } from './subject/subject-detail/subject-detail.component';
import { SubjectSidebarComponent } from './subject/subject-sidebar/subject-sidebar.component';
import { SubjectStudentsComponent } from './subject/subject-students/subject-students.component';

const Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'posts', component: MainComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'subjects/:id', component: SubjectDetailComponent },
  { path: 'subjects/:id/students', component: SubjectStudentsComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/subjects', component: AdminSubjectsComponent },
  { path: 'admin/assignments', component: AdminAssignmentsComponent },
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
    SubjectStudentsComponent
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
    RouterModule.forRoot(Routes),

    // Material Modules
    MatListModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatTableModule
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
