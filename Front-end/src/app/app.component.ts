import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { StorageService } from './services/storage.service';
import * as AuthActions from './store/auth/auth.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      width: 100%;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // Check stored auth on app initialization
    this.store.dispatch(AuthActions.checkStoredAuth());
  }
}
