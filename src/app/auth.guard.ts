import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  console.log(authService.isLoggedIn());
  //If the route is /profile and the user is not logged in, redirect to /login
  if (state.url === '/profile' && !authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  if (state.url === '/saves' && !authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return authService.isLoggedIn();
};
