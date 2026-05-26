import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;
  apiDelay = 0;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['General User', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    const { userId, password } = this.loginForm.value;
    this.authService.login({ userId, password }, this.apiDelay).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  fillDemo(role: 'admin' | 'user'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({ userId: 'admin@mploychek.com', password: 'Admin@123', role: 'Admin' });
    } else {
      this.loginForm.patchValue({ userId: 'ayush@mploychek.com', password: 'User@123', role: 'General User' });
    }
  }

  get f() { return this.loginForm.controls; }
}
