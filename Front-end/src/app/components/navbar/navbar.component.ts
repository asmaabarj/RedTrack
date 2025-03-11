import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthRole, selectUserProfile } from '../../store/auth/auth.selectors';
import { UserProfileResponse } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role$: Observable<string | null>;
  userProfile$: Observable<UserProfileResponse | null>;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.role$ = this.store.select(selectAuthRole);
    this.userProfile$ = this.store.select(selectUserProfile);
  }

  ngOnInit() {
    this.store.dispatch(AuthActions.loadUserProfile());
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still navigate to login even if server request fails
        this.router.navigate(['/login']);
      }
    });
  }
}
