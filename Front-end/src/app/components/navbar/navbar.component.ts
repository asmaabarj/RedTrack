import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  role$: Observable<string | null>;
  userProfile$: Observable<UserProfileResponse | null>;
  isDropdownOpen = false;

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  // Close dropdown when clicking escape key
  @HostListener('window:keydown.escape')
  onEscapePress() {
    this.closeDropdown();
  }
}
