import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { StorageService } from './services/storage.service';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Front-end';

  constructor(
    private store: Store,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const auth = this.storageService.getAuth();
    if (auth) {
      this.store.dispatch(AuthActions.loginSuccess(auth));
    }
  }
}
