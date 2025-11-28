import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/userauth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // تحقق إذا المستخدم مسجل الدخول
  if (authService.getCurrentUser()) {
    return true;
  } else { 
    // إعادة التوجيه للصفحة login وحفظ الصفحة المطلوبة
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
