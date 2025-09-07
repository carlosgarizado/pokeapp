import { TestBed } from '@angular/core/testing';

import { PokeDataService } from './poke-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DetailPokemon, PokemonApiResponse, PokemonListResponse } from '../models/pokemon.model';
import { environment } from '../../environments/environment';


describe('PokeDataService', () => {
  let service: PokeDataService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/pokemon`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeDataService]
    });
    service = TestBed.inject(PokeDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a page of pokemons', () => {
    const mockResponse: PokemonListResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: `${apiUrl}/1` }]
    };
  
    service.getPokemonPage(0, 1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(`${apiUrl}?offset=0&limit=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
  it('should fetch pokemon detail and map response', () => {
    const mockApiResponse: PokemonApiResponse = {
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      weight: 69,
      sprites: {
        front_default: 'front.png',
        back_default: 'back.png',
        front_shiny: null,
        back_shiny: null
      },
      moves: [{ move: { name: 'tackle', url: '' } }]
    } as any;

    service.getPokemonDetail(`${apiUrl}/1`).subscribe((res: DetailPokemon) => {
      expect(res.id).toBe(1);
      expect(res.name).toBe('bulbasaur');
      expect(res.weight).toBe('69kg'); // se agrega "kg"
      expect(res.types).toEqual(['grass']);
      expect(res.sprites).toEqual(['front.png', 'back.png']);
      expect(res.moves).toEqual(['tackle']);
      expect(res.color).toBeDefined(); // viene de typeColors o #fff
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should fetch pokemon by name', () => {
    const mockApiResponse = { id: 25, name: 'pikachu' } as any;

    service.getPokemonByName('Pikachu').subscribe((res) => {
      expect(res.name).toBe('pikachu');
      expect(res.id).toBe(25);
    });

    const req = httpMock.expectOne(`${apiUrl}/pikachu`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should fetch multiple pokemon details with forkJoin', () => {
    const mockResults = [
      { name: 'bulbasaur', url: `${apiUrl}/1` },
      { name: 'pikachu', url: `${apiUrl}/25` }
    ];

    const mockBulbasaur: PokemonApiResponse = {
      id: 1,
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      weight: 69,
      sprites: { front_default: 'front.png' } as any,
      moves: [{ move: { name: 'tackle', url: '' } }]
    } as any;

    const mockPikachu: PokemonApiResponse = {
      id: 25,
      name: 'pikachu',
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      weight: 60,
      sprites: { front_default: 'pika.png' } as any,
      moves: [{ move: { name: 'thunder', url: '' } }]
    } as any;

    service.getPokemonDetailsList(mockResults).subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].name).toBe('bulbasaur');
      expect(res[1].name).toBe('pikachu');
    });

    const req1 = httpMock.expectOne(`${apiUrl}/1`);
    req1.flush(mockBulbasaur);

    const req2 = httpMock.expectOne(`${apiUrl}/25`);
    req2.flush(mockPikachu);
  });
});