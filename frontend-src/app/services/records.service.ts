import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VerificationRecord, DashboardStats } from '../models/record.model';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  constructor(private http: HttpClient) {}

  getRecords(delay: number = 0): Observable<VerificationRecord[]> {
    const params = new HttpParams().set('delay', delay.toString());
    return this.http.get<VerificationRecord[]>(`${environment.apiUrl}/records`, { params });
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/stats`);
  }
}
