// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { UserProfileResponse } from '../../models/auth.model';
// import * as AuthActions from '../../store/auth/auth.actions';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
//   isDropdownOpen = false;
//   userProfile$: Observable<UserProfileResponse>;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private store: Store
//   ) {
//     this.userProfile$ = this.authService.getCurrentUserProfile();
//   }

//   ngOnInit(): void {}

//   toggleDropdown(): void {
//     this.isDropdownOpen = !this.isDropdownOpen;
//   }

//   logout(): void {
//     this.store.dispatch(AuthActions.logout());
//   }
// }
