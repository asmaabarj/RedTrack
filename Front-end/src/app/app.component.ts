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
    // Check stored authentication
    const authData = this.storageService.getAuth();
    if (authData?.token && authData?.role) {
      // Restore auth state from localStorage
      this.store.dispatch(AuthActions.loginSuccess({ 
        response: { 
          token: authData.token, 
          role: authData.role 
        }
      }));
    }
  }
}
