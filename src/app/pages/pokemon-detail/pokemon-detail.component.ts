import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokeDataService } from '../../core/services/poke-data.service';
import { DetailPokemon } from '../../core/models/pokemon.model';
import { typeColors } from '../../constants/pokemon-types';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent implements OnInit {
  pokemon?: DetailPokemon;
  pokemonName!: string;

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pokemonName = this.route.snapshot.paramMap.get('name')!;
    this.getPokemon();
  }

  getPokemon() {
    const storedPokemons: DetailPokemon[] = JSON.parse(localStorage.getItem('customPokemons') || '[]');
    const localPokemon = storedPokemons.find(
      (p) => p.name.toLowerCase() === this.pokemonName.toLowerCase()
    );

    if (localPokemon) {
      this.pokemon = localPokemon;
      return;
    }

    this.pokeService.getPokemonByName(this.pokemonName).subscribe({
      next: (res) => {
        this.pokemon = {
          id: res.id,
          name: res.name,
          types: res.types.map((t: any) => t.type.name),
          weight: res.weight + 'kg',
          sprites: [
            res.sprites.front_default,
            res.sprites.back_default,
            res.sprites.front_shiny,
            res.sprites.back_shiny,
          ].filter(Boolean),
          moves: res.moves.map((m: any) => m.move.name),
          color: typeColors[res.types[0].type.name] || '#fff',
        };
      },
      error: (err) => {
        console.error(err);
        this.pokemon = undefined;
      },
    });
  }

  back() {
    this.router.navigate(['/pokemons']);
  }
}
