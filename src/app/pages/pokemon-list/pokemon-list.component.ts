import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { PokeDataService } from '../../core/services/poke-data.service';
import { Pokemon, PokemonListResponse } from '../../core/models/pokemon.model';
import { CommonModule } from '@angular/common';
import { typeColors } from '../../constants/pokemon-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [SearchBarComponent, CardComponent, CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = []; 
  totalCount = 0;
  limit = 4;
  currentOffset = 0;

  constructor(private pokeService: PokeDataService, private router: Router) {}

  ngOnInit(): void {
    this.getPokemonList();
  }

  getPokemonList() {
    const storedPokemons = JSON.parse(localStorage.getItem('customPokemons') || '[]');
  
    this.pokeService.getPokemonPage(this.currentOffset, this.limit).subscribe({
      next: (res) => {
        this.totalCount = res.count + storedPokemons.length;

        if (this.currentOffset < res.count) {
          this.pokeService.getPokemonDetailsList(res.results).subscribe({
            next: (details) => {
              this.pokemonList = details.map(d => ({
                name: d.name,
                id: d.id,
                img: d.sprites[0],
                color: d.color
              }));
              
            },
            error: (err) => console.error(err)
          });
        } else {
          const customOffset = this.currentOffset - res.count;
          const customPage = storedPokemons.slice(customOffset, customOffset + this.limit);
          this.pokemonList = customPage;
        }
      },
      error: (err) => console.error(err)
    });
  }
  

  searchByName(name: string) {
    if (!name) {
      this.getPokemonList();
      return;
    }

    this.pokeService.getPokemonByName(name).subscribe({
      next: (res) => {
        this.pokemonList = [{
          name: res.name,
          id: res.id,
          img: res.sprites.front_default,
          color: typeColors[res.types[0].type.name] || '#fff'
        }];
      },
      error: () => {
        const storedPokemons = JSON.parse(localStorage.getItem('customPokemons') || '[]');
        const found = storedPokemons.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
        this.pokemonList = found ? [found] : [];
      }
    });
  }

  nextPage() {
    this.currentOffset += this.limit;
    this.getPokemonList();
  }

  previousPage() {
    this.currentOffset -= this.limit;
    if (this.currentOffset < 0) this.currentOffset = 0;
    this.getPokemonList();
  }

  addPokemon() {
    this.router.navigate(['/add-pokemon']);
  }
}