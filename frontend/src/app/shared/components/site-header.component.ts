import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="solid-nav">
      <div class="wrap nav-inner">
        <a routerLink="/" class="brand">
          <svg class="globe" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="46" stroke="var(--vermilion)" stroke-width="2.5"/>
            <ellipse cx="50" cy="50" rx="22" ry="46" stroke="currentColor" stroke-width="2"/>
            <ellipse cx="50" cy="50" rx="42" ry="46" stroke="currentColor" stroke-width="1.4" opacity=".5"/>
            <line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" stroke-width="2"/>
            <path d="M9 31 H91 M9 69 H91" stroke="currentColor" stroke-width="1.4" opacity=".5"/>
          </svg>
          <span>DAW Consulting<small>Human Resources</small></span>
        </a>
        <div class="nav-links">
          <a routerLink="/" fragment="services">Services</a>
          <a routerLink="/" fragment="modele">Modèle intérim</a>
          <a routerLink="/" fragment="histoire">Notre histoire</a>
          <a routerLink="/emplois">Offres d'emploi</a>
        </div>
        <a routerLink="/emplois" class="btn btn-primary">Voir les offres <span class="arrow">↗</span></a>
      </div>
    </nav>
  `
})
export class SiteHeaderComponent {}
