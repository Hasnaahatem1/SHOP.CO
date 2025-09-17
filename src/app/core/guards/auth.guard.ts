import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserauthService } from '../services/auth/userauth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let _UserauthService=inject(UserauthService)
  let router=inject(Router);
  if(_UserauthService.getUserLogged()){
    return true
  }
  else{ 
    router.navigateByUrl('/login')
    return false;
  }
};
