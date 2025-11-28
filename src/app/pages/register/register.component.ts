import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/userauth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // تسجيل عبر Email/Password
  async register() {
    this.errorMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      const result = await this.authService.register(this.email, this.password, this.name);

      if (result.success && result.user) {
        console.log('User registered:', result.user);
        this.router.navigate(['/home']); // Redirect after registration
      } else {
        this.errorMessage = result.message || 'Registration failed. Please try again.';
      }
    } catch (err) {
      console.error('Registration error:', err);
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  }

  async loginWithGoogle() {
    try {
      const result = await this.authService.signInWithGoogle();
      if (result.success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.message || 'Google login failed';
      }
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Google login error';
    }
  }

  
  
}
