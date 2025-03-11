import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-content">
      <h1>Dashboard Formateur</h1>
    </div>
  `
})
export class FormateurDashboardComponent {}
