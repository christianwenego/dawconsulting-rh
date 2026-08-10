import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ContractType, JobRequest, JobStatus, CONTRACT_LABELS, JOB_STATUS_LABELS } from '../../core/models/job.model';

@Component({
  selector: 'app-admin-job-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './job-form.component.html'
})
export class AdminJobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  contractTypes = Object.entries(CONTRACT_LABELS) as [ContractType, string][];
  jobStatuses = Object.entries(JOB_STATUS_LABELS) as [JobStatus, string][];

  form = this.fb.group({
    title: ['', [Validators.required]],
    department: [''],
    location: ['', [Validators.required]],
    contractType: ['INTERIM' as ContractType, [Validators.required]],
    experienceLevel: [''],
    description: ['', [Validators.required]],
    responsibilities: [''],
    requirements: [''],
    salaryMin: [null as number | null],
    salaryMax: [null as number | null],
    status: ['PUBLISHED' as JobStatus, [Validators.required]],
    closingDate: ['' as string | null]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editId.set(id);
      this.loading.set(true);
      this.api.adminGetJob(id).subscribe({
        next: (job) => {
          this.form.patchValue({
            ...job,
            closingDate: job.closingDate ? job.closingDate.substring(0, 10) : ''
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Offre introuvable.');
          this.loading.set(false);
        }
      });
    }
  }

  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    const v = this.form.value;
    const payload: JobRequest = {
      title: v.title!,
      department: v.department || undefined,
      location: v.location!,
      contractType: v.contractType!,
      experienceLevel: v.experienceLevel || undefined,
      description: v.description!,
      responsibilities: v.responsibilities || undefined,
      requirements: v.requirements || undefined,
      salaryMin: v.salaryMin != null && v.salaryMin !== ('' as any) ? Number(v.salaryMin) : null,
      salaryMax: v.salaryMax != null && v.salaryMax !== ('' as any) ? Number(v.salaryMax) : null,
      status: v.status!,
      closingDate: v.closingDate ? new Date(v.closingDate).toISOString() : null
    };

    const obs = this.editId()
      ? this.api.adminUpdateJob(this.editId()!, payload)
      : this.api.adminCreateJob(payload);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'L\'enregistrement a échoué.');
      }
    });
  }
}
