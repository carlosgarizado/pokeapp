import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { PokeDataService } from '../../core/services/poke-data.service';
import { Router } from '@angular/router';
import { typeColors } from '../../constants/pokemon-types';
import { DetailPokemon, Pokemon, PokemonListResponse } from '../../core/models/pokemon.model';
import { of, throwError } from 'rxjs';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokeServiceSpy: jasmine.SpyObj<PokeDataService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    pokeServiceSpy = jasmine.createSpyObj('PokeDataService', [
      'getPokemonPage',
      'getPokemonDetailsList',
      'getPokemonByName'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // 👇 default values to not break ngOnInit
    pokeServiceSpy.getPokemonPage.and.returnValue(
      of({ count: 0, next: null, previous: null, results: [] } as PokemonListResponse)
    );
    pokeServiceSpy.getPokemonDetailsList.and.returnValue(of([] as DetailPokemon[]));
    pokeServiceSpy.getPokemonByName.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent], // standalone component
      providers: [
        { provide: PokeDataService, useValue: pokeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokémons from the API', () => {
    const mockApiResponse: PokemonListResponse = {
      count: 10,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: 'poke/1' }]
    };

    const mockDetails: DetailPokemon[] = [
      {
        id: 1,
        name: 'bulbasaur',
        types: ['grass'],
        weight: '69kg',
        sprites: ['img1'],
        moves: [],
        color: '#fff'
      }
    ];

    pokeServiceSpy.getPokemonPage.and.returnValue(of(mockApiResponse));
    pokeServiceSpy.getPokemonDetailsList.and.returnValue(of(mockDetails));

    component.getPokemonList();

    expect(component.pokemonList.length).toBe(1);
    expect(component.pokemonList[0].name).toBe('bulbasaur');
  });

  it('should search for a Pokémon in the API', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      weight: 60,
      sprites: {
        front_default: 'pikachu.png',
        back_default: '',
        front_shiny: '',
        back_shiny: ''
      },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      moves: []
    };

    pokeServiceSpy.getPokemonByName.and.returnValue(of(mockPokemon));

    component.searchByName('pikachu');

    expect(component.pokemonList[0].name).toBe('pikachu');
    expect(component.pokemonList[0].color).toBe(typeColors['electric']);
  });

  it('should search for a Pokémon in localStorage if not found in the API', () => {
    const storedPokemons: Pokemon[] = [
      { id: 999, name: 'customachu', img: 'imgZ', color: '#111' }
    ];
    localStorage.setItem('customPokemons', JSON.stringify(storedPokemons));

    pokeServiceSpy.getPokemonByName.and.returnValue(throwError(() => new Error('not found')));

    component.searchByName('customachu');

    expect(component.pokemonList[0].name).toBe('customachu');
  });

  it('should navigate to add Pokémon', () => {
    component.addPokemon();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/add-pokemon']);
  });
});
