import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/userauth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    const result = await this.authService.login(this.email, this.password);

    if (result.success) {
      this.router.navigate(['/']);
    } else {
      // إذا الحساب غير موجود أو البريد/كلمة المرور خطأ
      this.errorMessage = result.message || 'Account not found';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
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
