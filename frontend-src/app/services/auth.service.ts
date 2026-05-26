import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage(): User | null {
    const u = localStorage.getItem('mpc_user');
    return u ? JSON.parse(u) : null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('mpc_token');
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  login(req: LoginRequest, delay: number = 0): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login?delay=${delay}`, req).pipe(
      tap(res => {
        localStorage.setItem('mpc_token', res.token);
        localStorage.setItem('mpc_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap(user => {
        localStorage.setItem('mpc_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('mpc_token');
    localStorage.removeItem('mpc_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser;
  }
}
