import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, JobFilter } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS } from '../../core/models/job.model';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';
import { SeoService } from '../../core/services/seo.service';
import { SITE_SEO } from '../../core/services/site-seo.constants';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [RouterLink, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);

  jobs = signal<Job[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  q = '';
  location = '';
  department = '';

  readonly contractLabels = CONTRACT_LABELS;

  ngOnInit(): void {
    this.seo.update({
      title: 'Offres d’emploi à Douala et au Cameroun | DAW Consulting RH',
      description: 'Découvrez les offres d’emploi, missions d’intérim et opportunités de recrutement proposées par DAW Consulting RH à Douala et au Cameroun.',
      path: '/emplois',
      jsonLd: [
        {
          '@type': 'CollectionPage',
          name: 'Offres d’emploi DAW Consulting RH',
          url: `${SITE_SEO.url}/emplois`,
          inLanguage: 'fr-CM',
          isPartOf: { '@id': `${SITE_SEO.url}/#website` }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_SEO.url },
            { '@type': 'ListItem', position: 2, name: 'Offres d’emploi', item: `${SITE_SEO.url}/emplois` }
          ]
        }
      ]
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const filter: JobFilter = {
      q: this.q.trim() || undefined,
      location: this.location.trim() || undefined,
      department: this.department.trim() || undefined
    };
    this.api.listPublishedJobs(filter).subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les offres pour le moment. Vérifiez que le serveur est démarré.');
        this.loading.set(false);
      }
    });
  }

  reset(): void {
    this.q = '';
    this.location = '';
    this.department = '';
    this.load();
  }

  jobUrl(job: Job): string {
    return this.seo.jobPath(job.id, job.title);
  }

  excerpt(text: string): string {
    return text.length > 180 ? text.slice(0, 180).trim() + '…' : text;
  }
}
