import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }

    const user = JSON.parse(localStorage.getItem('current_user'));
    if (!user) {
      this.router.navigate(['login']);
      return false;
    }

    if (user.role !== 'Admin' && user.role !== 'Profesor') {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
