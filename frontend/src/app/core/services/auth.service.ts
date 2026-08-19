import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'dawc_token';
const USER_KEY = 'dawc_user';
const EXP_KEY = 'dawc_exp';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private base = environment.apiUrl;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private _user = signal<AuthUser | null>(this.readUser());

  readonly user = this._user.asReadonly();

  readonly isAuthenticated = computed(
    () => this._user() !== null && !this.isExpired()
  );

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.base}/auth/login`, credentials)
      .pipe(
        tap((res) => this.persist(res))
      );
  }

  logout(): void {
    if (!this.isBrowser) {
      this._user.set(null);
      return;
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXP_KEY);

    this._user.set(null);
  }

  get token(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  isExpired(): boolean {
    if (!this.isBrowser) {
      return true;
    }

    const exp = localStorage.getItem(EXP_KEY);

    if (!exp) {
      return true;
    }

    return Date.now() > Number(exp);
  }

  private persist(res: AuthResponse): void {
    const user: AuthUser = {
      fullName: res.fullName,
      email: res.email
    };

    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(
        EXP_KEY,
        String(Date.now() + res.expiresInMs)
      );
    }

    this._user.set(user);
  }

  private readUser(): AuthUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const raw = localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}