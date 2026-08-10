import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS, JOB_STATUS_LABELS } from '../../core/models/job.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);

  jobs = signal<Job[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  readonly contractLabels = CONTRACT_LABELS;
  readonly statusLabels = JOB_STATUS_LABELS;

  published = computed(() => this.jobs().filter((j) => j.status === 'PUBLISHED').length);
  totalApplications = computed(() => this.jobs().reduce((s, j) => s + j.applicationCount, 0));
  drafts = computed(() => this.jobs().filter((j) => j.status === 'DRAFT').length);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.adminListJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les offres.');
        this.loading.set(false);
      }
    });
  }

  remove(job: Job): void {
    if (!confirm(`Supprimer définitivement l'offre « ${job.title} » et ses candidatures ?`)) return;
    this.api.adminDeleteJob(job.id).subscribe({
      next: () => this.jobs.update((list) => list.filter((j) => j.id !== job.id)),
      error: () => alert('La suppression a échoué.')
    });
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
