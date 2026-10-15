import { ArrowUpRight, MapPin } from 'lucide-react';
import './LocationSection.css';

export function LocationSection() {
  return (
    <section id="localisation" className="location-section" aria-labelledby="location-title">
      <div className="wrap location-grid">
        <div className="location-copy">
          <div className="eyebrow">NOUS TROUVER</div>
          <h2 id="location-title">Proches de vos<br /><em>projets.</em></h2>
          <p>ProRenoNeuf vous accueille à La Rochelle pour parler de vos travaux de maçonnerie, rénovation et couverture.</p>
          <div className="location-address"><MapPin size={20} aria-hidden="true" /><address>1 rue Ernest Meissonnier<br />17000 La Rochelle</address></div>
          <a className="button outline" href="https://www.google.com/maps/search/?api=1&query=1+rue+Ernest+Meissonnier+17000+La+Rochelle" target="_blank" rel="noreferrer">Ouvrir dans Google Maps <ArrowUpRight size={17} /></a>
        </div>
        <div className="location-map-wrap">
          <iframe className="location-map" title="Localisation de ProRenoNeuf à La Rochelle" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3786.0339056997736!2d-1.2989649710489195!3d46.174224255418196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48015351fea605df%3A0x33c224c3140a0cf4!2s1%20Rue%20Ernest%20Meissonnier%2C%2017000%20La%20Rochelle!5e0!3m2!1sfr!2sfr!4v1792031538725!5m2!1sfr!2sfr" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </div>
    </section>
  );
}
