import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthRole } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  role$: Observable<string | null>;

  constructor(private store: Store) {
    this.role$ = this.store.select(selectAuthRole);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
