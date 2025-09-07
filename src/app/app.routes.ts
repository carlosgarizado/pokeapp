import { Routes } from '@angular/router';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { AddPokemonComponent } from './pages/add-pokemon/add-pokemon.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonListComponent },
    { path: 'pokemons/:name', component: PokemonDetailComponent },
    { path: 'add-pokemon', component: AddPokemonComponent },
    { path: '**', redirectTo: 'pokemons' }
  ];
