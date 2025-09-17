import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserauthService } from '../../core/services/auth/userauth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({

  standalone:true,
  imports:[FormsModule,CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: UserauthService, private router: Router) {}

  submit() {
    if (this.authService.isUserExist(this.username)) {
      // لو موجود → تحقق كلمة السر
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[this.username].password === this.password) {
        this.authService.login(this.username);
        this.router.navigate(['/']); // redirect للصفحة الرئيسية
      } else {
        this.errorMessage = 'Incorrect password';
      }
    } else {
      // لو مش موجود → ارسل المستخدم لصفحة التسجيل
      this.router.navigate(['/register'], { queryParams: { username: this.username } });
    }
  }
}
