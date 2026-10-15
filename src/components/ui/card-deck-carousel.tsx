import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProjectSlide } from '../../data/projects';
import './card-deck-carousel.css';

export const wrap = (index: number, length: number) => length ? ((index % length) + length) % length : 0;
export const isThrow = (distance: number, velocity: number, width: number) =>
  Math.abs(distance) > width * 0.28 || (Math.abs(velocity) > 0.55 && Math.abs(distance) > 24);

type Props = { slides: ProjectSlide[] };
type Drag = { pointer: number; x: number; y: number; lastX: number; time: number; velocity: number };

export default function CardDeckCarousel({ slides }: Props) {
  // A changed collection starts a fresh deck, cancelling pending transitions.
  return <Deck key={JSON.stringify(slides)} slides={slides}/>;
}

function Deck({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [flying, setFlying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const deckRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingIndex = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setReduced(preference.matches);
      if (preference.matches) {
        clearTimeout(timer.current);
        if (pendingIndex.current !== null) setIndex(pendingIndex.current);
        pendingIndex.current = null;
        dragRef.current = null;
        busy.current = false;
        setDragging(false);
        setFlying(false);
        setOffset(0);
      }
    };
    preference.addEventListener('change', onChange);
    return () => {
      clearTimeout(timer.current);
      preference.removeEventListener('change', onChange);
      dragRef.current = null;
    };
  }, []);

  function change(direction: number) {
    if (busy.current || count < 2) return;
    const target = wrap(index + direction, count);
    if (reduced) {
      setIndex(target);
      setOffset(0);
      return;
    }
    busy.current = true;
    pendingIndex.current = target;
    setFlying(true);
    setOffset(-direction * (deckRef.current?.clientWidth ?? 400) * 1.3);
    timer.current = setTimeout(() => {
      setIndex(target);
      setFlying(false);
      setOffset(0);
      pendingIndex.current = null;
      busy.current = false;
    }, 480);
  }

  function cancelDrag() {
    dragRef.current = null;
    setDragging(false);
    if (!busy.current) setOffset(0);
  }

  function down(event: PointerEvent<HTMLDivElement>) {
    if (busy.current || count < 2 || dragRef.current || !event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, time: event.timeStamp, velocity: 0 };
    setDragging(true);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(event.clientY - drag.y) > Math.abs(dx) + 12) { cancelDrag(); return; }
    drag.velocity = (event.clientX - drag.lastX) / Math.max(1, event.timeStamp - drag.time);
    drag.lastX = event.clientX;
    drag.time = event.timeStamp;
    if (!reduced) setOffset(dx);
  }

  function up(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    const dx = event.clientX - drag.x;
    const velocity = event.timeStamp - drag.time < 100 ? drag.velocity : 0;
    if (isThrow(dx, velocity, deckRef.current?.clientWidth ?? 400)) change(dx < 0 ? 1 : -1);
    else setOffset(0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  if (!count) return <p className="deck-empty">Les photographies seront bientôt disponibles.</p>;
  const active = slides[index];
  return (
    <div className="project-carousel" role="region" aria-roledescription="carrousel" aria-label="Galerie de photographies" tabIndex={0}
      onKeyDown={event => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        if (!dragRef.current) change(event.key === 'ArrowRight' ? 1 : -1);
      }}>
      <div className="project-deck-stage">
        <div className="project-deck" ref={deckRef}>
          {slides.map((slide, i) => {
            const depth = wrap(i - index, count);
            const top = depth === 0;
            const angle = reduced || top ? 0 : [0, -5, 5, -3][Math.min(depth, 3)];
            const style = {
              transform: top ? `translateX(${offset}px) rotate(${reduced ? 0 : offset * 0.025}deg)` : `translateY(${-Math.min(depth, 3) * 12}px) scale(${1 - Math.min(depth, 3) * .045}) rotate(${angle}deg)`,
              zIndex: count - depth,
              opacity: depth > 3 || (top && flying) ? 0 : 1,
            } as CSSProperties;
            return <div key={slide.id} className="project-deck-card" style={style} aria-hidden={!top}
              data-top={top} data-dragging={top && dragging} data-flying={top && flying}
              onPointerDown={top ? down : undefined} onPointerMove={top ? move : undefined}
              onPointerUp={top ? up : undefined} onPointerCancel={top ? cancelDrag : undefined}
              onLostPointerCapture={top ? cancelDrag : undefined}>
              <img src={slide.image} alt={top ? slide.alt : ''} width="480" height="600" loading="lazy" decoding="async" draggable={false}
                onError={event => {
                  const image = event.currentTarget;
                  if (image.dataset.fallback) return;
                  image.dataset.fallback = 'true';
                  image.src = '/images/building-fallback.svg';
                  image.alt = top ? 'Illustration de bâtiment, image de remplacement' : '';
                }}/>
            </div>;
          })}
        </div>
      </div>
      <div className="project-deck-meta">
        {count > 1 && <button type="button" aria-label="Photo précédente" aria-disabled={flying} onClick={() => { if (!dragRef.current) change(-1); }}><ArrowLeft size={19}/></button>}
        <div className="project-deck-caption"><h3>{active.title}</h3><p>{active.caption}</p></div>
        <span className="project-deck-count" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        {count > 1 && <button type="button" aria-label="Photo suivante" aria-disabled={flying} onClick={() => { if (!dragRef.current) change(1); }}><ArrowRight size={19}/></button>}
      </div>
      <p className="project-deck-sr" aria-live="polite" aria-atomic="true">Photo {index + 1} sur {count} : {active.title}. {active.caption}</p>
    </div>
  );
}
