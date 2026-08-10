import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS } from '../../core/models/job.model';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './job-detail.component.html'
})
export class JobDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  job = signal<Job | null>(null);
  loading = signal(true);
  notFound = signal(false);

  readonly contractLabels = CONTRACT_LABELS;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPublishedJob(id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
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
