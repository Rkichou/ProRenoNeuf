import { useEffect, useRef, useState } from 'react';
import { statsConfig } from '../../data/stats';
import './StatsSection.css';

const numberFormat = new Intl.NumberFormat('fr-FR');

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) ? 1 : 0,
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | undefined;
    let observer: IntersectionObserver | undefined;
    let started = false;
    let disposed = false;

    const finish = () => {
      started = true;
      observer?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      setProgress(1);
    };

    const onMotionChange = () => {
      if (motionPreference.matches) finish();
    };

    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      finish();
    } else {
      observer = new IntersectionObserver(entries => {
        if (disposed || started || !entries.some(entry => entry.isIntersecting)) return;
        started = true;
        observer?.disconnect();
        let startTime: number | undefined;
        const tick = (timestamp: number) => {
          if (disposed) return;
          startTime ??= timestamp;
          const elapsed = Math.min((timestamp - startTime) / statsConfig.durationMs, 1);
          setProgress(elapsed === 1 ? 1 : 1 - (1 - elapsed) ** 3);
          if (elapsed < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, { threshold: 0.15 });
      observer.observe(section);
    }

    motionPreference.addEventListener('change', onMotionChange);
    return () => {
      disposed = true;
      observer?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      motionPreference.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <section ref={sectionRef} className="stats-section" aria-label="Chiffres clés" aria-describedby={statsConfig.illustrative ? 'stats-notice' : undefined}>
      <div className="wrap">
        <dl className="stats-list">
          {statsConfig.items.map(stat => (
            <div className="stats-item" key={stat.id}>
              <dt>{stat.label}</dt>
              <dd>
                <span className="stats-accessible">{stat.accessibleValue}</span>
                <span className="stats-number" aria-hidden="true">
                  <span className="stats-reserved">{stat.prefix}{numberFormat.format(stat.value)}{stat.suffix}</span>
                  <span className="stats-counter">
                    <span className="stats-affix">{stat.prefix}</span>
                    {numberFormat.format(Math.floor(stat.value * progress))}
                    <span className="stats-affix">{stat.suffix}</span>
                  </span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
