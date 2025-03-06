import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-formatteur-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-content">
      <h1>Formateur Dashboard</h1>
    </div>
  `
})
export class FormatteurDashboardComponent {}
