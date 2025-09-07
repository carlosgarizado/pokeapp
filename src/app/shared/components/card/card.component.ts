import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() name?: string;
  @Input() index?: number;
  @Input() img?: string;
  @Input() color?: string;

  constructor(private router: Router) {}

  select() {
    this.router.navigate(['/pokemons', this.name?.toLowerCase()]);
  }
}
