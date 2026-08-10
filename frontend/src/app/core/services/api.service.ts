import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Job, JobApplication, JobRequest, ApplicationStatus } from '../models/job.model';

export interface JobFilter {
  q?: string;
  department?: string;
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ---------- Public ----------
  listPublishedJobs(filter: JobFilter = {}): Observable<Job[]> {
    let params = new HttpParams();
    if (filter.q) params = params.set('q', filter.q);
    if (filter.department) params = params.set('department', filter.department);
    if (filter.location) params = params.set('location', filter.location);
    return this.http.get<Job[]>(`${this.base}/jobs`, { params });
  }

  getPublishedJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.base}/jobs/${id}`);
  }

  applyToJob(id: number, data: FormData): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.base}/jobs/${id}/apply`, data);
  }

  sendContact(payload: { name: string; email: string; phone?: string; company?: string; message: string; }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/contact`, payload);
  }

  // ---------- Admin: jobs ----------
  adminListJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.base}/admin/jobs`);
  }

  adminGetJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.base}/admin/jobs/${id}`);
  }

  adminCreateJob(payload: JobRequest): Observable<Job> {
    return this.http.post<Job>(`${this.base}/admin/jobs`, payload);
  }

  adminUpdateJob(id: number, payload: JobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.base}/admin/jobs/${id}`, payload);
  }

  adminDeleteJob(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/admin/jobs/${id}`);
  }

  // ---------- Admin: applications ----------
  adminListApplications(jobId?: number): Observable<JobApplication[]> {
    let params = new HttpParams();
    if (jobId != null) params = params.set('jobId', String(jobId));
    return this.http.get<JobApplication[]>(`${this.base}/admin/applications`, { params });
  }

  adminUpdateApplicationStatus(id: number, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.base}/admin/applications/${id}/status`, { status });
  }

  adminDeleteApplication(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/admin/applications/${id}`);
  }

  downloadCv(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.base}/admin/applications/${applicationId}/cv`, { responseType: 'blob' });
  }
}
