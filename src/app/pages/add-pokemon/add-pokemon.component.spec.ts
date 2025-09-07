import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPokemonComponent } from './add-pokemon.component';
import { DetailPokemon } from '../../core/models/pokemon.model';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddPokemonComponent', () => {
  let component: AddPokemonComponent;
  let fixture: ComponentFixture<AddPokemonComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPokemonComponent, ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPokemonComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.pokemonForm).toBeTruthy();
  });

  it('should add a new type control', () => {
    const initialLength = component.types.length;
    component.addType();
    expect(component.types.length).toBe(initialLength + 1);
  });

  it('should add a new sprite control', () => {
    const initialLength = component.sprites.length;
    component.addSprite();
    expect(component.sprites.length).toBe(initialLength + 1);
  });

  it('should add a new move control', () => {
    const initialLength = component.moves.length;
    component.addMove();
    expect(component.moves.length).toBe(initialLength + 1);
  });

  it('should save pokemon when form is valid', () => {
    spyOn(router, 'navigate');
    const pokemon: DetailPokemon = {
      id: 1,
      name: 'pikachu',
      types: ['electric'],
      weight: '10kg',
      sprites: ['sprite1.png'],
      moves: ['thunderbolt'],
      color: '#ffcc00'
    };

    component.pokemonForm.setValue(pokemon);

    component.savePokemon();

    const stored = JSON.parse(localStorage.getItem('customPokemons') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe('pikachu');
    expect(router.navigate).toHaveBeenCalledWith(['/pokemons']);
  });

  it('should not save pokemon when form is invalid', () => {
    spyOn(router, 'navigate');
    component.pokemonForm.get('name')?.setValue('');
    component.savePokemon();

    const stored = JSON.parse(localStorage.getItem('customPokemons') || '[]');
    expect(stored.length).toBe(0);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back when back() is called', () => {
    spyOn(router, 'navigate');
    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/pokemons']);
  });
});