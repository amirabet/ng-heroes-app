import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { map, tap } from 'rxjs';

import { AuthService } from './../services/auth.service';

export const publicGuard = () => {
    const authService = inject(AuthService); 
    const router = inject(Router); 
    return authService.checkAuthentication().pipe( 
        tap( isAuthenticated => {
            if(isAuthenticated){
                console.log('isAuthenticated')
                router.navigate(['./'])
            }
            else
                !isAuthenticated
        }),
        map((isAuthenticated) => !isAuthenticated) 
  ); 
};