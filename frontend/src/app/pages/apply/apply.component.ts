import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Job, CONTRACT_LABELS } from '../../core/models/job.model';
import { SiteHeaderComponent } from '../../shared/components/site-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './apply.component.html'
})
export class ApplyComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private seo = inject(SeoService);

  job = signal<Job | null>(null);
  loadingJob = signal(true);
  submitting = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);
  cvFile = signal<File | null>(null);
  cvError = signal<string | null>(null);

  readonly contractLabels = CONTRACT_LABELS;
  private jobId!: number;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    coverLetter: ['']
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Postuler à une offre | DAW Consulting RH',
      description: 'Formulaire de candidature DAW Consulting RH.',
      path: `/emplois/${this.route.snapshot.paramMap.get('id')}/postuler`,
      robots: 'noindex,follow'
    });
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getPublishedJob(this.jobId).subscribe({
      next: (job) => {
        this.job.set(job);
        this.loadingJob.set(false);
      },
      error: () => {
        this.error.set('Cette offre est introuvable ou fermée.');
        this.loadingJob.set(false);
      }
    });
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.cvError.set(null);
    if (!file) {
      this.cvFile.set(null);
      return;
    }
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !/\.(pdf|docx?|)$/i.test(file.name)) {
      this.cvError.set('Format non supporté. Utilisez un PDF ou un document Word.');
      this.cvFile.set(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.cvError.set('Le fichier dépasse 5 Mo.');
      this.cvFile.set(null);
      return;
    }
    this.cvFile.set(file);
  }

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    const fd = new FormData();
    fd.append('fullName', this.form.value.fullName!);
    fd.append('email', this.form.value.email!);
    if (this.form.value.phone) fd.append('phone', this.form.value.phone);
    if (this.form.value.coverLetter) fd.append('coverLetter', this.form.value.coverLetter);
    if (this.cvFile()) fd.append('cv', this.cvFile()!);

    this.api.applyToJob(this.jobId, fd).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || 'Une erreur est survenue lors de l\'envoi. Vous avez peut-être déjà postulé à cette offre avec cet email.');
      }
    });
  }
}
