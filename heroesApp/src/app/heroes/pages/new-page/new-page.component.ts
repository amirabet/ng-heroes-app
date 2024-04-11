import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, switchMap, tap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {
  
  // Grupo de formualrio reactivo:
  public heroForm = new FormGroup({
    id:  new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }), // always with value
    publisher: new FormControl<Publisher>(Publisher.DCComics), // type of enum
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img :new FormControl(''),
  });

  // This getter allows to cast form data to Heroe
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  constructor( 
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router : Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
   ){}

  ngOnInit(): void {

    if( !this.router.url.includes('edit') )
      return;

    this.activatedRoute.params.
      pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id )),
      ).subscribe ( hero => {
        if ( !hero ) 
          return this.router.navigate( ['/heroes/list'] );

        //this.heroForm.setValue() => set values one by one
        this.heroForm.reset( hero );
        return;
      });
  }

  goBack(): void {
    this.router.navigate( ['/heroes/list'] );
  }

  onSubmit(): void {
    if( this.heroForm.invalid )
      return;

    if( this.currentHero.id ) {
      this.heroesService.updatedHero( this.currentHero )
        .subscribe( hero =>{
          this.showSnackbar(`${ hero.superhero } updated`)
        });

        return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero =>{
        this.showSnackbar(`${ hero.superhero } updated`);
        this.router.navigate(['heroes/edit/' + hero.id])
      })

  }

  onDeleteHero(){
    if( !this.currentHero.id )
      throw Error ('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result:boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter( (wasDeleted:boolean) => wasDeleted )
      )
      .subscribe( () => this.goBack());
    

      // .subscribe(result => {
      //   if (!result)
      //     return;
        
      //   this.heroesService.deleteHeroById(this.currentHero.id)
      //     .subscribe( wasDeleted =>{
      //       if(wasDeleted)
      //         this.goBack();
      //       else
      //        /*TODO: show a snackbar warning of failed deletion */
      //     })
      //   this.goBack();
    // });
  }

  showSnackbar( message:string ):void {
    let snackBarRef = this.snackBar.open (message, 'TO HEROES LIST', {
      duration: 12500
    })

    snackBarRef.onAction().subscribe(() => {
      this.goBack();
    });
  }

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'marvel Comics', desc: 'Marvel - Comics' },
  ]
}
