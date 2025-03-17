import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    activeFormateurs: 0,
    activeApprenants: 0,
    activeClasses: 0
  };

  constructor(
    private router: Router,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
