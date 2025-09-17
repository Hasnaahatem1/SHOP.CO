import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserauthService } from '../../core/services/auth/userauth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;

  usernameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  termsError: string = '';

  constructor(private authService: UserauthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
    });
  }

  validate(): boolean {
    let valid = true;
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.termsError = '';

    if (!this.username) {
      this.usernameError = 'Username is required';
      valid = false;
    }
    if (!this.email) {
      this.emailError = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      this.emailError = 'Email is invalid';
      valid = false;
    }
    if (!this.password) {
      this.passwordError = 'Password is required';
      valid = false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      valid = false;
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      valid = false;
    }
    if (!this.acceptTerms) {
      this.termsError = 'You must accept the terms';
      valid = false;
    }

    return valid;
  }

  register() {
    if (!this.validate()) return;

    this.authService.register(this.username, this.email, this.password);
    this.router.navigate(['/']);
  }
}
