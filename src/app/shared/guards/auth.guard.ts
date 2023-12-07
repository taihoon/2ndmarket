import { first, map, tap } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/core/http';


export const authGuard: CanActivateFn =
  () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.authState$.pipe(
      first(),
      map(user => !!user),
      tap(user =>
        user || router.navigateByUrl('/auth/group-select').then()
      )
    );
  }
