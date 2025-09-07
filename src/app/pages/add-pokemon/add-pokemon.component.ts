import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailPokemon } from '../../core/models/pokemon.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-pokemon',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-pokemon.component.html',
  styleUrl: './add-pokemon.component.scss'
})
export class AddPokemonComponent implements OnInit {
  pokemonForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.pokemonForm = this.fb.group({
      id: [null, Validators.required],
      name: ['', Validators.required],
      types: this.fb.array([this.fb.control('', Validators.required)]),
      weight: ['', Validators.required],
      sprites: this.fb.array([this.fb.control('', Validators.required)]),
      moves: this.fb.array([this.fb.control('', Validators.required)]),
      color: ['#ffffff', Validators.required]
    });
  }
  get types(): FormArray {
    return this.pokemonForm.get('types') as FormArray;
  }

  get sprites(): FormArray {
    return this.pokemonForm.get('sprites') as FormArray;
  }

  get moves(): FormArray {
    return this.pokemonForm.get('moves') as FormArray;
  }

  addType() {
    this.types.push(this.fb.control(''));
  }

  addSprite() {
    this.sprites.push(this.fb.control(''));
  }

  addMove() {
    this.moves.push(this.fb.control(''));
  }

  savePokemon() {
    if (this.pokemonForm.valid) {
      const pokemon: DetailPokemon = this.pokemonForm.value;
      const storedPokemons = JSON.parse(localStorage.getItem('customPokemons') || '[]');
      storedPokemons.push(pokemon);
      localStorage.setItem('customPokemons', JSON.stringify(storedPokemons));
      this.router.navigate(['/pokemons']);
    } else {
      this.pokemonForm.markAllAsTouched();
    }
  }
  

  back(){
    this.router.navigate(['/pokemons']);
  }
}
