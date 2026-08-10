import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, JobFilter } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS } from '../../core/models/job.model';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [RouterLink, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {
  private api = inject(ApiService);

  jobs = signal<Job[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  q = '';
  location = '';
  department = '';

  readonly contractLabels = CONTRACT_LABELS;

  ngOnInit(): void {
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

  excerpt(text: string): string {
    return text.length > 180 ? text.slice(0, 180).trim() + '…' : text;
  }
}
