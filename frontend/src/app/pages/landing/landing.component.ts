import { Component, ElementRef, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/components/site-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, SiteFooterComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private onScroll = () => {};

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root: HTMLElement = this.host.nativeElement;
    const nav = root.querySelector('#nav');
    this.onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (reduce || !gsap) {
      root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const q = (sel: string) => root.querySelectorAll(sel);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(q('.hero h1 .line span'), { yPercent: 120, duration: 1, stagger: 0.12 })
      .from(q('.hero .eyebrow'), { y: 20, opacity: 0, duration: 0.6 }, 0.1)
      .from(q('.hero p.lead'), { y: 24, opacity: 0, duration: 0.7 }, '-=.5')
      .from(q('.hero-cta'), { y: 24, opacity: 0, duration: 0.6 }, '-=.4')
      .from(q('.hero-meta .item'), { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=.4');

    const globe = root.querySelector('.hero-globe');
    if (globe) {
      gsap.fromTo(globe, { opacity: 0, scale: 0.9, rotate: -8 }, { opacity: 0.9, scale: 1, rotate: 0, duration: 1.8, ease: 'power2.out' });
      gsap.to(globe, { rotate: 360, duration: 120, repeat: -1, ease: 'none' });
    }

    gsap.utils.toArray(q('.reveal')).forEach((el: any) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });

    const path = root.querySelector('#triPath') as SVGPathElement | null;
    if (path && ScrollTrigger) {
      ScrollTrigger.create({
        trigger: '#triStage',
        start: 'top 70%',
        onEnter: () => gsap.to(path, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
      });
      gsap.from(q('.node .chip, .node-center, .edge-label'), {
        opacity: 0, scale: 0.85, duration: 0.6, stagger: 0.12, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '#triStage', start: 'top 60%' }
      });
      gsap.to(q('.triDot'), { scale: 1.5, transformOrigin: 'center', repeat: -1, yoyo: true, duration: 1.2, stagger: 0.2, ease: 'sine.inOut' });
    }

    const svcGrid = root.querySelector('.svc-grid');
    if (svcGrid && ScrollTrigger) {
      gsap.from(q('.svc'), {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 80%' }
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
      window.ScrollTrigger?.getAll?.().forEach((t: any) => t.kill());
    }
  }
}
