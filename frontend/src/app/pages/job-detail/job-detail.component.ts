import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS } from '../../core/models/job.model';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';
import { SeoService } from '../../core/services/seo.service';
import { SITE_SEO } from '../../core/services/site-seo.constants';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './job-detail.component.html'
})
export class JobDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  job = signal<Job | null>(null);
  loading = signal(true);
  notFound = signal(false);

  readonly contractLabels = CONTRACT_LABELS;

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id') ?? '';
    const id = Number(rawId.split('-')[0]);
    if (!Number.isFinite(id) || id <= 0) {
      this.notFound.set(true);
      this.loading.set(false);
      this.seo.update({ title: 'Offre introuvable | DAW Consulting RH', description: 'Cette offre d’emploi est introuvable.', path: this.route.url.toString(), robots: 'noindex,follow' });
      return;
    }
    this.api.getPublishedJob(id).subscribe({
      next: (job) => {
        this.job.set(job);
        const path = this.seo.jobPath(job.id, job.title);
        const description = this.excerpt(job.description, 155);
        const jsonLd: Record<string, unknown> = {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.title,
          description: this.toHtml(job.description),
          datePosted: job.createdAt,
          validThrough: job.closingDate ?? undefined,
          employmentType: this.employmentType(job.contractType),
          hiringOrganization: {
            '@type': 'Organization',
            name: SITE_SEO.name,
            sameAs: SITE_SEO.url,
            logo: `${SITE_SEO.url}/favicon.ico`
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.location,
              addressCountry: SITE_SEO.country
            }
          },
          directApply: true,
          url: this.seo.absoluteUrl(path)
        };
        if (job.salaryMin != null || job.salaryMax != null) {
          jsonLd['baseSalary'] = {
            '@type': 'MonetaryAmount',
            currency: 'XAF',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salaryMin ?? job.salaryMax,
              maxValue: job.salaryMax ?? job.salaryMin,
              unitText: 'MONTH'
            }
          };
        }
        this.seo.update({
          title: `${job.title} à ${job.location} | DAW Consulting RH`,
          description,
          path,
          type: 'article',
          jsonLd: [
            jsonLd,
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_SEO.url },
                { '@type': 'ListItem', position: 2, name: 'Offres d’emploi', item: `${SITE_SEO.url}/emplois` },
                { '@type': 'ListItem', position: 3, name: job.title, item: this.seo.absoluteUrl(path) }
              ]
            }
          ]
        });
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.seo.update({ title: 'Offre introuvable | DAW Consulting RH', description: 'Cette offre d’emploi est introuvable ou n’est plus publiée.', path: `/emplois/${rawId}`, robots: 'noindex,follow' });
        this.loading.set(false);
      }
    });
  }

  private employmentType(contractType: string): string {
    const map: Record<string, string> = {
      CDI: 'FULL_TIME',
      CDD: 'CONTRACTOR',
      INTERIM: 'TEMPORARY',
      STAGE: 'INTERN',
      MISSION: 'CONTRACTOR',
      FREELANCE: 'CONTRACTOR'
    };
    return map[contractType] ?? 'OTHER';
  }

  excerpt(text: string, max: number): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
  }

  private toHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }

  asList(text?: string): string[] {
    if (!text) return [];
    return text.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter((l) => l.length > 0);
  }

  formatSalary(job: Job): string | null {
    if (job.salaryMin == null && job.salaryMax == null) return null;
    const fmt = (n: number) => n.toLocaleString('fr-FR');
    if (job.salaryMin != null && job.salaryMax != null) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} FCFA`;
    if (job.salaryMin != null) return `À partir de ${fmt(job.salaryMin)} FCFA`;
    return `Jusqu'à ${fmt(job.salaryMax!)} FCFA`;
  }
}
