import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StateService } from './services/state.service';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  private stateService = inject(StateService);

  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.stateService.getToken();

    if (token) {
      const clone = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clone);
    }
    return next.handle(request);
  }
}
