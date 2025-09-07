import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent  implements OnDestroy {
  searchControl = new FormControl('');
  @Output() searchChange = new EventEmitter<string>();
  private destroy$ = new Subject<void>();
  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.searchChange.emit((value || '').trim().toLowerCase());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
