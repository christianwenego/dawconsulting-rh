import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteUrl = 'https://dawconsultinghr.com';
  private readonly defaultImage = `${this.siteUrl}/favicon.ico`;
  private readonly defaultImageAlt = 'DAW Consulting Human Resources';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  update(config: SeoConfig): void {
    const canonicalUrl = this.absoluteUrl(config.path ?? '/');
    const image = config.image ?? this.defaultImage;

    this.title.setTitle(config.title);
    this.setMeta('description', config.description);
    this.setMeta('robots', config.robots ?? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');

    this.setProperty('og:title', config.title);
    this.setProperty('og:description', config.description);
    this.setProperty('og:type', config.type ?? 'website');
    this.setProperty('og:url', canonicalUrl);
    this.setProperty('og:image', image);
    this.setProperty('og:image:alt', config.image ? config.title : this.defaultImageAlt);
    this.setProperty('og:site_name', 'DAW Consulting Human Resources');
    this.setProperty('og:locale', 'fr_CM');

    this.setProperty('twitter:card', 'summary_large_image');
    this.setProperty('twitter:title', config.title);
    this.setProperty('twitter:description', config.description);
    this.setProperty('twitter:image', image);
    this.setProperty('twitter:url', canonicalUrl);

    this.setCanonical(canonicalUrl);
    this.replaceJsonLd(config.jsonLd ?? []);
  }

  absoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  jobPath(id: number, title: string): string {
    return `/emplois/${id}-${this.slugify(title)}`;
  }

  private setMeta(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private replaceJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): void {
    const existing = this.document.head.querySelector('script[data-seo-jsonld]');
    existing?.remove();

    if (!this.document) return;
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', 'true');
    script.text = JSON.stringify(Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : data);
    this.document.head.appendChild(script);
  }
}
