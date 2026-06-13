import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, defaultIfEmpty, map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree  | Observable<boolean | UrlTree>  => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  const user = authService.currentUserValue;

  // if (!token) {
  //   return router.createUrlTree(['/login'], {
  //     queryParams: { returnUrl: state.url },
  //   });
  // }

  // if (!user) {
  //    return authService.loadCurrentUser().pipe(
  //       defaultIfEmpty(null),
  //       map((response) => {
  //         if (!response || !response.success) {
  //           return router.createUrlTree(['/login'], {
  //             queryParams: { returnUrl: state.url },
  //           });
  //         }
  //           return true;
  //         }),
  //       catchError(() =>
  //         of(
  //           router.createUrlTree(['/login'], {
  //             queryParams: { returnUrl: state.url },
  //           }),
  //         ),
  //       ),
  //     );
  //}else{
    return true
  //}





};
