import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then((m) => m.LandingComponent),
    title: 'DAW Consulting RH — Conformité sociale & intérim au Cameroun'
  },
  {
    path: 'services/:slug',
    loadComponent: () => import('./pages/service/service-page.component').then((m) => m.ServicePageComponent),
    title: 'Services RH — DAW Consulting Human Resources'
  },
  {
    path: 'emplois',
    loadComponent: () => import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
    title: 'Offres d\'emploi — DAWC-HR'
  },
  {
    path: 'emplois/:id',
    loadComponent: () => import('./pages/job-detail/job-detail.component').then((m) => m.JobDetailComponent),
    title: 'Détail de l\'offre — DAWC-HR'
  },
  {
    path: 'emplois/:id/postuler',
    loadComponent: () => import('./pages/apply/apply.component').then((m) => m.ApplyComponent),
    title: 'Postuler — DAWC-HR'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login.component').then((m) => m.AdminLoginComponent),
    title: 'Connexion administrateur — DAWC-HR'
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
        title: 'Tableau de bord — DAWC-HR'
      },
      {
        path: 'offres/nouvelle',
        loadComponent: () => import('./admin/job-form/job-form.component').then((m) => m.AdminJobFormComponent),
        title: 'Nouvelle offre — DAWC-HR'
      },
      {
        path: 'offres/:id/modifier',
        loadComponent: () => import('./admin/job-form/job-form.component').then((m) => m.AdminJobFormComponent),
        title: 'Modifier l\'offre — DAWC-HR'
      },
      {
        path: 'candidatures',
        loadComponent: () => import('./admin/applications/applications.component').then((m) => m.AdminApplicationsComponent),
        title: 'Candidatures — DAWC-HR'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page introuvable — DAWC-HR'
  }
];
