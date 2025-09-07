import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailComponent } from './pokemon-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PokeDataService } from '../../core/services/poke-data.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DetailPokemon } from '../../core/models/pokemon.model';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let pokeServiceSpy: jasmine.SpyObj<PokeDataService>;

  beforeEach(async () => {
    pokeServiceSpy = jasmine.createSpyObj('PokeDataService', ['getPokemonByName']);
    pokeServiceSpy.getPokemonByName.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent, RouterTestingModule],
      providers: [
        { provide: PokeDataService, useValue: pokeServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ name: 'gastly' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load Pokémon details from the API', () => {
    const mockApiPokemon = {
      id: 92,
      name: 'gastly',
      weight: 1,
      sprites: {
        front_default: 'front.png',
        back_default: 'back.png',
        front_shiny: 'front_shiny.png',
        back_shiny: 'back_shiny.png'
      },
      types: [{ slot: 1, type: { name: 'ghost', url: '' } }],
      moves: [{ move: { name: 'lick', url: '' } }]
    };

    pokeServiceSpy.getPokemonByName.and.returnValue(of(mockApiPokemon));

    fixture.detectChanges();

    expect(pokeServiceSpy.getPokemonByName).toHaveBeenCalledWith('gastly');
    expect(component.pokemon?.name).toBe('gastly');
    expect(component.pokemon?.sprites.length).toBe(4);
    expect(component.pokemon?.types[0]).toBe('ghost');
  });

  it('should load Pokémon from localStorage if it exists', () => {
    const localPokemon: DetailPokemon = {
      id: 1000,
      name: 'gastly',
      types: ['ghost'],
      weight: '10kg',
      sprites: ['local.png'],
      moves: ['shadow-ball'],
      color: '#333'
    };

    localStorage.setItem('customPokemons', JSON.stringify([localPokemon]));

    fixture.detectChanges();

    expect(pokeServiceSpy.getPokemonByName).not.toHaveBeenCalled();
    expect(component.pokemon?.id).toBe(1000);
    expect(component.pokemon?.sprites[0]).toBe('local.png');
  });
});
