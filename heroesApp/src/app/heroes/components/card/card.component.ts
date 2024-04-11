import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Hero } from '../../interfaces/heroe.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: ``
})
export class CardComponent implements OnInit {

  constructor ( 
    private router : Router
  ) {}

  @Input()
  public hero!: Hero;

  @Input()
  public compact: boolean =  false;

  ngOnInit(): void {
    if (!this.hero)
      throw Error ('Hero property is required');
  }

  goToHeroPage( id: string ){
    this.router.navigate( ['/heroes/', id ] );
  }

}
