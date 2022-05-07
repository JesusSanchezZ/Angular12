import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // Pone un término de búsqueda en el observable
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // espera 300ms después de cada golpe de tecla antes de considerar el termino
      debounceTime(300),

      // ignora un nuevo término si es el mismo que el anterior
      distinctUntilChanged(),

      // cambia a la nueva busqueda observable cada vez que el término cambia
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
