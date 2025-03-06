import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-apprenant-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-content">
      <h1>Apprenant Dashboard</h1>
      <!-- other content -->
    </div>
  `
})
export class ApprenantDashboardComponent {}
