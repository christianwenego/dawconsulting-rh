import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="login-wrap">
      <div style="text-align:center;color:#fff;max-width:460px">
        <div class="eyebrow" style="color:var(--gold);justify-content:center">Erreur 404</div>
        <h1 style="font-size:clamp(2.4rem,6vw,4rem);margin:14px 0">Page introuvable.</h1>
        <p style="color:rgba(255,255,255,.75);margin-bottom:28px">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a routerLink="/" class="btn btn-light">Retour à l'accueil</a>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  constructor(seo: SeoService) {
    seo.update({
      title: 'Page introuvable | DAW Consulting RH',
      description: 'La page demandée est introuvable ou a été déplacée.',
      robots: 'noindex,follow'
    });
  }
}
