import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from './../services/auth.service';

/*
* Old Guard made with Class => deprecated!
*/
// @Injectable({
//     providedIn: 'root'
// })
// export class AuthGuard implements CanMatchFn, CanActivateFn {
 //   (...) 
// }

export const authGuard = () => {
    const authService = inject(AuthService); 
    const router = inject(Router); 
    return authService.checkAuthentication().pipe( 
        map((user) => !!user), 
        map((isLoggedIn) => isLoggedIn || 
            router.navigate(['./auth/login'])) 
  ); 
};