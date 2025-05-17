import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  const router = inject(Router); 


  if (authService.authorized()) {
    if (state.url === '/welcome') {
      const username = authService.getUsernameFromToken();
      setTimeout(() => {
        router.navigate(['/user', username]);
      }, 50);
      return false; 
    }
    return true;
  } else {
    return true;
  }
};
