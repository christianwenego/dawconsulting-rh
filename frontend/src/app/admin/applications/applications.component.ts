import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { JobApplication, ApplicationStatus, STATUS_LABELS } from '../../core/models/job.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './applications.component.html'
})
export class AdminApplicationsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  applications = signal<JobApplication[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  expanded = signal<number | null>(null);
  jobFilter: number | null = null;

  readonly statusLabels = STATUS_LABELS;
  readonly statusKeys = Object.keys(STATUS_LABELS) as ApplicationStatus[];

  ngOnInit(): void {
    const jobId = this.route.snapshot.queryParamMap.get('jobId');
    this.jobFilter = jobId ? Number(jobId) : null;
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.adminListApplications(this.jobFilter ?? undefined).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les candidatures.');
        this.loading.set(false);
      }
    });
  }

  toggle(id: number): void {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  changeStatus(app: JobApplication, status: ApplicationStatus): void {
    if (status === app.status) return;
    this.api.adminUpdateApplicationStatus(app.id, status).subscribe({
      next: (updated) => this.applications.update((list) => list.map((a) => (a.id === app.id ? updated : a))),
      error: () => alert('La mise à jour du statut a échoué.')
    });
  }

  download(app: JobApplication): void {
    this.api.downloadCv(app.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = app.cvOriginalName || `cv-${app.fullName}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Téléchargement impossible.')
    });
  }

  remove(app: JobApplication): void {
    if (!confirm(`Supprimer la candidature de ${app.fullName} ?`)) return;
    this.api.adminDeleteApplication(app.id).subscribe({
      next: () => this.applications.update((list) => list.filter((a) => a.id !== app.id)),
      error: () => alert('La suppression a échoué.')
    });
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}
