import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('Interceptor executed');
    console.log('Original URL:', req.url);

    const token = localStorage.getItem('accessToken');

    console.log('Token:', token);

    if (token) {

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Authorization header added');
    }

    return next.handle(req);
  }
}