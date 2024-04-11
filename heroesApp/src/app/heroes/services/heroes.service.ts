import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/heroe.interface';
import { enviroments } from '../../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class HeroesService {

    private baseUrl: string = enviroments.baseUrl;

    constructor(private http: HttpClient) {}

    getHeroes(): Observable<Hero[]>{
        return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
    }

    getHeroById(id: string): Observable<Hero | undefined>{
        return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                // En caso de error retornamos otro observable usando "of" de RxJS
                catchError( error => of(undefined)  )
            )
    }

    getHeroesSuggestions( query: string ): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`);
    }

    addHero( hero: Hero ): Observable<Hero> {
        return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
    }

    updatedHero( hero: Hero ): Observable<Hero> {
        if( !hero.id )
            throw Error ('Hero is required');

        return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero);
    }

    deleteHeroById( id: string ): Observable<boolean> {
        
        return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                map ( resp => true),
                catchError( error => of(false)),
            );
    }
}