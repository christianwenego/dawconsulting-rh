import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer id="contact">
      <div class="wrap">
        <div class="foot-grid">
          <div class="foot-brand">
            <a routerLink="/" class="brand">
              <svg class="globe" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="var(--vermilion)" stroke-width="2.5"/>
                <ellipse cx="50" cy="50" rx="22" ry="46" stroke="var(--gold)" stroke-width="2"/>
                <line x1="4" y1="50" x2="96" y2="50" stroke="var(--gold)" stroke-width="2"/>
              </svg>
              <span>DAW Consulting<small>Interim · Services</small></span>
            </a>
            <p>Cabinet de consulting RH et de placement temporaire. Nous aidons les entreprises camerounaises à naviguer les méandres administratifs en toute sérénité.</p>
          </div>
          <div class="foot-col">
            <h4>Contact</h4>
            <a href="tel:+237697251734">+237 697 25 17 34</a>
            <a href="tel:+237679475152">+237 679 47 51 52</a>
            <a href="mailto:daw16consulting@gmail.com">daw16consulting&#64;gmail.com</a>
            <p>BP 17596, Douala — Cameroun</p>
          </div>
          <div class="foot-col">
            <h4>Liens</h4>
            <a href="https://www.linkedin.com/company/daw-consulting-human-ressources" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://www.facebook.com/profile.php?id=61566193556441" target="_blank" rel="noopener">Facebook</a>
            <a routerLink="/services/audit-cnps-cameroun">Audit CNPS</a>
            <a routerLink="/services/gestion-paie-cameroun">Gestion de la paie</a>
            <a routerLink="/services/externalisation-rh-cameroun">Externalisation RH</a>
            <a routerLink="/services/interim-placement-cameroun">Intérim &amp; placement</a>
            <a routerLink="/services/recrutement-cameroun">Recrutement</a>
            <a routerLink="/emplois">Offres d'emploi</a>
            <a routerLink="/admin/login">Espace administrateur</a>
          </div>
        </div>
        <div class="legal">
          <span>© 2026 DAW Consulting Human Resources — Tous droits réservés.</span>
          <span>RCCM RC/DLA/2021/B/4825 · NIU MO92116462141R </span>
          <!-- · Certifié ISO 9001:2015  -->
        </div>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {}
