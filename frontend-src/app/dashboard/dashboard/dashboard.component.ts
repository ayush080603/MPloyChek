import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RecordsService } from '../../services/records.service';
import { VerificationRecord, DashboardStats } from '../../models/record.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser!: User;
  records: VerificationRecord[] = [];
  filteredRecords: VerificationRecord[] = [];
  stats: DashboardStats | null = null;
  loadingRecords = true;
  apiDelay = 0;
  searchTerm = '';
  filterStatus = 'all';
  sortField: keyof VerificationRecord = 'candidateName';
  sortAsc = true;
  isAdmin = false;

  statusOptions = ['all', 'Verified', 'Pending', 'In Progress', 'Failed'];

  constructor(private authService: AuthService, private recordsService: RecordsService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    this.isAdmin = this.authService.isAdmin;
    this.loadData();
  }

  loadData(): void {
    this.loadingRecords = true;
    this.recordsService.getRecords(this.apiDelay).subscribe({
      next: (data) => {
        this.records = data;
        this.applyFilters();
        this.loadingRecords = false;
      },
      error: () => { this.loadingRecords = false; }
    });
    if (this.isAdmin) {
      this.recordsService.getStats().subscribe(s => this.stats = s);
    }
  }

  applyFilters(): void {
    let res = [...this.records];
    if (this.searchTerm) {
      const s = this.searchTerm.toLowerCase();
      res = res.filter(r => r.candidateName.toLowerCase().includes(s) || r.position.toLowerCase().includes(s));
    }
    if (this.filterStatus !== 'all') {
      res = res.filter(r => r.status === this.filterStatus);
    }
    res.sort((a, b) => {
      const va = a[this.sortField] ?? '';
      const vb = b[this.sortField] ?? '';
      return this.sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    this.filteredRecords = res;
  }

  toggleSort(field: keyof VerificationRecord): void {
    if (this.sortField === field) { this.sortAsc = !this.sortAsc; }
    else { this.sortField = field; this.sortAsc = true; }
    this.applyFilters();
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Verified': 'badge-green', 'Pending': 'badge-yellow',
      'In Progress': 'badge-blue', 'Failed': 'badge-red'
    };
    return map[status] || 'badge-gray';
  }

  riskClass(risk: string): string {
    const map: Record<string, string> = { 'Low': 'risk-low', 'Medium': 'risk-med', 'High': 'risk-high' };
    return map[risk] || '';
  }
}
