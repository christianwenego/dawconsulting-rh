import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';
import { SeoService } from '../../core/services/seo.service';
import { SITE_SEO } from '../../core/services/site-seo.constants';

export interface ServiceSeoPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  sections: Array<{ title: string; text: string; points: string[] }>;
  keywords: string[];
}

export const SERVICE_PAGES: ServiceSeoPage[] = [
  {
    slug: 'audit-cnps-cameroun',
    title: 'Audit CNPS au Cameroun | Conformité sociale — DAW Consulting RH',
    h1: 'Audit CNPS au Cameroun : sécurisez votre conformité sociale',
    description: 'Audit CNPS, contrôle des cotisations et plan de mise en conformité pour les entreprises à Douala et au Cameroun. DAW Consulting RH identifie les écarts avant le contrôle.',
    intro: 'Un audit CNPS permet de vérifier vos déclarations, vos cotisations et vos obligations sociales avant qu’un contrôle ne transforme un écart administratif en redressement. DAW Consulting RH vous accompagne avec une approche structurée, confidentielle et orientée vers des actions concrètes.',
    sections: [
      { title: 'Ce que nous vérifions', text: 'Nous analysons les principaux éléments qui influencent votre conformité sociale et la qualité de vos dossiers.', points: ['Immatriculation et déclarations des salariés', 'Cohérence entre paie, effectifs et déclarations sociales', 'Cotisations et bases déclaratives', 'Dossiers de prestations et pièces justificatives', 'Écarts, risques et priorités de régularisation'] },
      { title: 'Un plan d’action après l’audit', text: 'L’objectif n’est pas de produire un rapport qui reste dans un tiroir. Nous hiérarchisons les écarts et définissons un plan de mise en conformité adapté à votre organisation.', points: ['Cartographie des écarts', 'Priorisation des risques', 'Recommandations opérationnelles', 'Accompagnement à la régularisation', 'Suivi des actions correctives'] }
    ],
    keywords: ['audit CNPS Cameroun', 'conformité CNPS', 'audit social Douala', 'cotisations CNPS']
  },
  {
    slug: 'gestion-paie-cameroun',
    title: 'Gestion de la paie au Cameroun | Externalisation — DAW Consulting RH',
    h1: 'Gestion de la paie au Cameroun : fiabilisez votre processus',
    description: 'Externalisez la gestion de la paie au Cameroun avec DAW Consulting RH : préparation des bulletins, suivi administratif, déclarations et contrôle des données sociales.',
    intro: 'La paie exige de la rigueur, de la confidentialité et des contrôles réguliers. DAW Consulting RH aide les entreprises à structurer et externaliser leur processus de paie afin de réduire les erreurs et la charge administrative.',
    sections: [
      { title: 'Une paie structurée et contrôlée', text: 'Nous vous accompagnons sur les étapes clés du cycle de paie et sur la qualité des données transmises.', points: ['Collecte et contrôle des variables de paie', 'Préparation et vérification des bulletins', 'Suivi des entrées et sorties', 'Contrôle des éléments sociaux', 'Suivi des déclarations et échéances'] },
      { title: 'Pourquoi externaliser la paie ?', text: 'L’externalisation permet à vos équipes de se concentrer sur les activités RH à plus forte valeur tout en bénéficiant d’un processus documenté.', points: ['Réduction des tâches administratives', 'Meilleure continuité du processus', 'Confidentialité des données', 'Contrôles et rapprochements réguliers', 'Interlocuteur RH unique'] }
    ],
    keywords: ['gestion paie Cameroun', 'externalisation paie Douala', 'paie Cameroun', 'prestataire paie']
  },
  {
    slug: 'externalisation-rh-cameroun',
    title: 'Externalisation RH au Cameroun | DAW Consulting Human Resources',
    h1: 'Externalisation RH au Cameroun : concentrez-vous sur votre cœur de métier',
    description: 'Externalisation RH à Douala et au Cameroun : administration du personnel, paie, conformité sociale et accompagnement des équipes avec DAW Consulting RH.',
    intro: 'Externaliser certaines fonctions RH permet de gagner du temps, de fiabiliser les processus et de disposer d’un interlocuteur spécialisé. DAW Consulting RH construit une prestation adaptée à la taille et aux contraintes de votre entreprise.',
    sections: [
      { title: 'Les fonctions RH que vous pouvez externaliser', text: 'Nous intervenons sur les activités administratives et sociales qui mobilisent vos équipes sans constituer votre cœur de métier.', points: ['Administration du personnel', 'Gestion et suivi de la paie', 'Conformité sociale et CNPS', 'Reporting RH et suivi des dossiers', 'Accompagnement des besoins de personnel'] },
      { title: 'Une externalisation pilotée', text: 'Vous conservez la décision et le contrôle. Nous prenons en charge les opérations convenues avec des points de suivi réguliers.', points: ['Périmètre de service défini', 'Processus et responsabilités clairs', 'Suivi des indicateurs', 'Communication régulière', 'Amélioration continue'] }
    ],
    keywords: ['externalisation RH Cameroun', 'outsourcing RH Douala', 'prestataire RH Cameroun', 'administration du personnel']
  },
  {
    slug: 'interim-placement-cameroun',
    title: 'Intérim et placement de personnel au Cameroun | DAW Consulting RH',
    h1: 'Intérim et placement de personnel au Cameroun',
    description: 'DAW Consulting RH propose des solutions d’intérim et de mise à disposition de personnel à Douala et au Cameroun pour répondre rapidement aux besoins de main-d’œuvre.',
    intro: 'Lorsque votre activité varie, que vous devez remplacer rapidement un salarié ou renforcer une équipe, l’intérim apporte de la flexibilité. DAW Consulting RH prend en charge le recrutement, l’encadrement administratif et le suivi des salariés intérimaires.',
    sections: [
      { title: 'Pour quels besoins ?', text: 'Nos solutions de mise à disposition sont conçues pour accompagner les pics d’activité et les besoins temporaires.', points: ['Renfort temporaire d’équipe', 'Remplacement d’absence', 'Pic saisonnier ou hausse de production', 'Missions ponctuelles', 'Besoins de profils opérationnels'] },
      { title: 'Un cadre clair pour l’entreprise cliente', text: 'Notre modèle sépare clairement la relation avec l’entreprise cliente, le contrat de mission et les responsabilités de chacun.', points: ['Sélection des profils', 'Contrat de mise à disposition', 'Contrat de mission', 'Suivi administratif et paie', 'Accompagnement pendant la mission'] }
    ],
    keywords: ['agence intérim Douala', 'intérim Cameroun', 'placement personnel Cameroun', 'mise à disposition personnel']
  },
  {
    slug: 'recrutement-cameroun',
    title: 'Recrutement au Cameroun | Cabinet RH à Douala — DAW Consulting',
    h1: 'Recrutement au Cameroun : trouvez les bons profils',
    description: 'Cabinet de recrutement à Douala, DAW Consulting RH accompagne les entreprises dans la recherche, la sélection et le placement de profils adaptés à leurs besoins.',
    intro: 'Un recrutement réussi commence par une compréhension précise du besoin. DAW Consulting RH aide les entreprises à transformer un poste à pourvoir en recherche de profil structurée, puis à sécuriser les étapes de sélection.',
    sections: [
      { title: 'Notre approche du recrutement', text: 'Nous travaillons à partir du contexte du poste, des compétences attendues et des contraintes opérationnelles de l’entreprise.', points: ['Qualification du besoin', 'Définition du profil recherché', 'Recherche et présélection', 'Entretiens et évaluation', 'Présentation de candidatures ciblées'] },
      { title: 'Recrutement et vivier de talents', text: 'Nos offres d’emploi en ligne permettent également de développer un vivier de candidats et de faciliter les candidatures spontanées.', points: ['Diffusion des opportunités', 'Collecte des candidatures', 'Préqualification', 'Suivi des candidats', 'Accompagnement à la prise de poste'] }
    ],
    keywords: ['cabinet recrutement Douala', 'recrutement Cameroun', 'cabinet RH Cameroun', 'emploi Douala']
  }
];

@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './service-page.component.html'
})
export class ServicePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  page: ServiceSeoPage | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.page = SERVICE_PAGES.find((p) => p.slug === slug) ?? null;
    if (!this.page) {
      this.seo.update({ title: 'Page introuvable | DAW Consulting RH', description: 'La page demandée est introuvable.', robots: 'noindex,follow' });
      return;
    }

    this.seo.update({
      title: this.page.title,
      description: this.page.description,
      path: `/services/${this.page.slug}`,
      jsonLd: [
        {
          '@type': 'Service',
          serviceType: this.page.h1,
          name: this.page.h1,
          description: this.page.description,
          provider: { '@type': 'Organization', name: SITE_SEO.name, url: SITE_SEO.url },
          areaServed: { '@type': 'Country', name: SITE_SEO.countryName },
          url: `${SITE_SEO.url}/services/${this.page.slug}`
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_SEO.url },
            { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_SEO.url}/#services` },
            { '@type': 'ListItem', position: 3, name: this.page.h1, item: `${SITE_SEO.url}/services/${this.page.slug}` }
          ]
        }
      ]
    });
  }
}
