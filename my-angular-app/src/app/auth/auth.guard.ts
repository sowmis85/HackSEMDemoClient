import { inject, Inject } from "@angular/core";
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from './service/auth.service' ;

export const authGuard: CanActivateFn = (route, state)=>
{
  const authService=inject(AuthService);
  const router=inject(Router);
 if (authService.isAuthenticated()) {
    return true; // Allow navigation to the route
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
}
