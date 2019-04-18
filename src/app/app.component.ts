import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {NavbarService} from './navbar/navbar.service';
import {LoginComponent} from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthService, private router: Router, navbarService: NavbarService) {
    this.router.config.unshift({ path: 'login', component: LoginComponent });
    this.isLoggedIn = localStorage.getItem('access_token') !== null;
    this.navbarService = navbarService;
  }

  links: Array<{ text: string, path: string }>;
  isLoggedIn = false;
  navbarService: any;

  ngOnInit() {
    this.links = this.navbarService.getLinks();
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
  }


  logout() {
    this.auth.logout();
    this.navbarService.updateLoginStatus(false);
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }

  login() {
    this.router.navigate(['login']);
  }
}
