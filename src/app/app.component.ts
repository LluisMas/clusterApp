import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NavbarService } from './navbar/navbar.service';
import { LoginComponent } from './login/login.component';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router, navbarService: NavbarService,  private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {

    this.router.config.unshift({ path: 'login', component: LoginComponent });
    this.isLoggedIn = localStorage.getItem('access_token') !== null;
    this.navbarService = navbarService;

    this.iconRegistry.addSvgIcon('green-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/greenarrow.svg'));
    this.iconRegistry.addSvgIcon('red-arrow', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/redarrow.svg'));
    this.iconRegistry.addSvgIcon('equals', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/equals.svg'));
    this.iconRegistry.addSvgIcon('gold', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/gold.svg'));
    this.iconRegistry.addSvgIcon('silver', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/silver.svg'));
    this.iconRegistry.addSvgIcon('bronze', this.sanitizer.bypassSecurityTrustResourceUrl('../assets/bronze.svg'));

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {

        this.user = JSON.parse(localStorage.getItem('current_user'));
        this.links = this.navbarService.getLinks();

        if (this.user && this.user.role === 'Estudiante' && ev.url !== '/profile' && ev.url !== '/login' && !this.user.changedPass) {
          this.router.navigate(['profile']).then( () => {
            alert('Cambia la contraseña antes de continuar');
          });
        }
      }
    });
  }

  links: Array<{ text: string, path: string, param: string}>;
  isLoggedIn = false;
  navbarService: any;
  user: any;

  ngOnInit() {
    this.links = this.navbarService.getLinks();
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
    this.user = JSON.parse(localStorage.getItem('current_user'));
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
