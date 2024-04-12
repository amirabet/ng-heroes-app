import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { enviroments } from '../../../enviroments/enviroments';
import { User } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl: string = enviroments.baseUrl;
    private _user?: User;
    private localStorageToken= 'token';
    
    constructor( private http: HttpClient ){}

    get currentUser(): User | undefined {
        if (!this._user)
            return undefined;

        // return { ...this._user}; => // create a new instance using spread operator

        /*
        * Usign new syntax sugar structuredClone from v17
        */
        return structuredClone( this._user );
    }

    logIn ( email: string, password:string ): Observable<User>{
        //http.post('login', email, passowrd);

        return this.http.get<User>(`${ this.baseUrl }/users/1`)
            .pipe(
                tap( user => this._user = user ),
                tap( user => localStorage.setItem(this.localStorageToken, 'faketoken.faketoken.faketoken') )
            );
    }

    checkAuthentication(): Observable<boolean> {
        if( !localStorage.getItem(this.localStorageToken) )
            return of(false);

        const token = localStorage.getItem(this.localStorageToken);

        return this.http.get<User>(`${ this.baseUrl }/users/1`)
            .pipe(
                tap( user => this._user = user ),
                map ( user => !!user ),
                catchError ( err => of(false) )
            );
    }


    logOut (): void{
        this._user = undefined;
        localStorage.clear();
    }

}