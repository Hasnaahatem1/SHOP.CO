import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserauthService {
  private AuthSubject: BehaviorSubject<boolean>;

  constructor() {
    // نقرأ التوكن من localStorage عند إنشاء السيرفس
    const logged = !!localStorage.getItem('token'); // true لو فيه توكن
    this.AuthSubject = new BehaviorSubject<boolean>(logged);
  }

  // تحقق إذا اليوزر موجود
  isUserExist(username: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return !!users[username];
  }

  // تسجيل مستخدم جديد
  register(username: string, email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[username] = { email, password };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('token', username); // نخزن التوكن
    this.AuthSubject.next(true); // نحدّث الـBehaviorSubject
  }

  // تسجيل الدخول
  login(username: string) {
    localStorage.setItem('token', username);
    this.AuthSubject.next(true);
  }

  // تسجيل الخروج
  logOut() {
    localStorage.removeItem('token');
    this.AuthSubject.next(false);
  }

  // هل المستخدم مسجل دخول؟
  getUserLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  // observable لمتابعة حالة تسجيل الدخول
  getAuthSubject(): BehaviorSubject<boolean> {
    return this.AuthSubject;
  }

  // نقدر نجيب اسم المستخدم الحالي من التوكن
  getCurrentUser(): string | null {
    return localStorage.getItem('token');
  }
}
