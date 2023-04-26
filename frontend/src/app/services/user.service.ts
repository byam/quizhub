import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IUser } from '../interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  signin(data: IUser) {
    return this.http.post<{ success: boolean; data: string }>(
      environment.HTTP_SERVER + '/api/users/signin',
      data
    );
  }

  signup(user: IUser) {
    return this.http.post<{ success: boolean; data: IUser }>(
      environment.HTTP_SERVER + '/api/users/signup',
      user
    );
  }
}
