import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { DetailPokemon, PokemonApiResponse, PokemonListResponse } from '../models/pokemon.model';
import { typeColors } from '../../constants/pokemon-types';

@Injectable({
  providedIn: 'root'
})
export class PokeDataService {

  private apiUrl = `${environment.apiUrl}/pokemon`;

  constructor(private http: HttpClient) {}

  getPokemonPage(offset: number, limit: number = 4): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }
  
  getPokemonDetail(url: string): Observable<DetailPokemon> {
    return this.http.get<PokemonApiResponse>(url).pipe(
      map(res => ({
        id: res.id,
        name: res.name,
        types: res.types.map(t => t.type.name),
        weight: res.weight + 'kg',
        sprites: [
          res.sprites.front_default,
          res.sprites.back_default,
          res.sprites.front_shiny,
          res.sprites.back_shiny
        ].filter(Boolean),
        moves: res.moves.map(m => m.move.name),
        color: typeColors[res.types[0].type.name] || '#fff'
      }))
    );
  }
  
  getPokemonDetailsList(results: { name: string; url: string }[]): Observable<DetailPokemon[]> {
    const requests = results.map(p => this.getPokemonDetail(p.url));
    return forkJoin(requests);
  }
  
  getPokemonByName(name: string): Observable<PokemonApiResponse> {
    return this.http.get<PokemonApiResponse>(`${this.apiUrl}/${name.toLowerCase()}`);
  }
}