import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs-compat/add/operator/do';
import { Router } from '@angular/router';



@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('current_user');

    let newreq = req;
    if (token !== null) {
      newreq = req.clone({
        headers: req
          .headers
          .set('Authorization', token)
          .set('user', user),
      });
    }

      return next.handle(newreq).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          localStorage.setItem('current_user', event.headers.get('user'));
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {

          if (err.status === 401) {
            this.router.navigate(['login']);
          }
        }
    });
  }
}
