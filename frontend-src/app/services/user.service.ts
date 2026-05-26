import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface CreateUserDto {
  userId: string;
  password: string;
  name: string;
  role: string;
  department: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, dto);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
