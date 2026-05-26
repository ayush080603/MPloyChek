import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, CreateUserDto } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  loadingUsers = true;
  showCreateForm = false;
  createForm!: FormGroup;
  createLoading = false;
  createError = '';
  createSuccess = '';
  deletingId: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['General User', Validators.required],
      department: ['Engineering', Validators.required]
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (u) => { this.users = u; this.loadingUsers = false; },
      error: () => { this.loadingUsers = false; }
    });
  }

  onCreateUser(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.createLoading = true;
    this.createError = '';
    this.createSuccess = '';
    const dto: CreateUserDto = this.createForm.value;
    this.userService.createUser(dto).subscribe({
      next: () => {
        this.createLoading = false;
        this.createSuccess = `User "${dto.name}" created successfully!`;
        this.createForm.reset({ role: 'General User', department: 'Engineering' });
        this.showCreateForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.createLoading = false;
        this.createError = err.error?.message || 'Failed to create user.';
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    this.deletingId = user.id;
    this.userService.deleteUser(user.id).subscribe({
      next: () => { this.deletingId = null; this.loadUsers(); },
      error: (err) => { this.deletingId = null; alert(err.error?.message || 'Delete failed.'); }
    });
  }

  get f() { return this.createForm.controls; }
}
