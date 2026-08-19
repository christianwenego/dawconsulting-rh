import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-shell">
      <div class="admin-top">
        <div class="wrap">
          <a routerLink="/admin/dashboard" class="brand">
            <svg class="globe" viewBox="0 0 100 100" fill="none" aria-hidden="true" style="color:#fff">
              <circle cx="50" cy="50" r="46" stroke="var(--vermilion)" stroke-width="2.5"/>
              <ellipse cx="50" cy="50" rx="22" ry="46" stroke="currentColor" stroke-width="2"/>
              <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>DAW Consulting<small>Administration</small></span>
          </a>
          <div class="who">
            <span>{{ auth.user()?.fullName }}</span>
            <button class="btn btn-sm" style="background:rgba(255,255,255,.12);color:#fff" (click)="logout()">Déconnexion</button>
          </div>
        </div>
      </div>

      <div class="admin-main">
        <div class="wrap">
          <div class="admin-tabs">
            <a routerLink="/admin/dashboard" routerLinkActive="active">Offres d'emploi</a>
            <a routerLink="/admin/candidatures" routerLinkActive="active">Candidatures</a>
            <a routerLink="/" target="_blank" style="margin-left:auto;color:var(--royal)">Voir le site ↗</a>
          </div>
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AdminShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  constructor(seo: SeoService) {
    seo.update({
      title: 'Administration | DAW Consulting RH',
      description: 'Espace d’administration DAW Consulting RH.',
      robots: 'noindex,nofollow,noarchive'
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
