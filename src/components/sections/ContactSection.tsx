import { useRef, useState, type FormEvent } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, ArrowUpRight, Clock, Download, MapPin, Phone } from 'lucide-react';
import { services } from '../../data/services';
import { getFirestoreDb } from '../../lib/firebase';

export function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const contact = String(data.get('contact')).trim();
    const next: Record<string, string> = {};
    if (!String(data.get('name')).trim()) next.name = 'Indiquez votre nom.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[\d\s().-]{10,20}$/.test(contact)) next.contact = 'Indiquez un e-mail ou un numéro de téléphone valide.';
    if (!data.get('service')) next.service = 'Sélectionnez le type de travaux.';
    if (String(data.get('message')).trim().length < 10) next.message = 'Décrivez votre projet en au moins 10 caractères.';
    setErrors(next); setSaved(false); setSaveError(false);
    if (Object.keys(next).length > 0) return;
    const db = getFirestoreDb();
    if (!db) { setSaveError(true); return; }
    setSending(true);
    try {
      await addDoc(collection(db, 'contactRequests'), { name: String(data.get('name')).trim(), contact, service: String(data.get('service')).trim(), message: String(data.get('message')).trim(), status: 'new', source: 'website', createdAt: serverTimestamp() });
    } catch {
      setSaved(false);
      setSaveError(true);
      return;
    } finally {
      setSending(false);
    }
    // React clears event.currentTarget after the synchronous event handler.
    // Use the captured form, and keep UI reset outside the Firestore error path.
    setSaveError(false);
    setSaved(true);
    form.reset();
  }

  function download() {
    const form = formRef.current; if (!form) return;
    const data = new FormData(form);
    const text = `Mon projet ProRenoNeuf\n\nNom : ${data.get('name')}\nContact : ${data.get('contact')}\nTravaux : ${data.get('service')}\n\n${data.get('message')}`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'mon-projet-prorenoneuf.txt'; link.click(); URL.revokeObjectURL(url);
  }

  return <section id="contact" className="contact"><div className="wrap contact-grid"><div><div className="eyebrow light">04 / PARLONS DE VOS TRAVAUX</div><h2>Votre prochain chapitre<br/><em>commence ici.</em></h2><p>Une rénovation en tête ? Une toiture à reprendre ?<br/>Contactez-nous pour échanger sur vos besoins.</p><a className="contact-phone" href="tel:+33687585279"><Phone size={22}/>06 87 58 52 79 <ArrowUpRight size={22}/></a><div className="contact-detail"><MapPin size={20}/><div>1 rue Ernest Meissonier<br/>17000 La Rochelle<a href="https://www.google.com/maps/search/?api=1&query=1+rue+Ernest+Meissonier+17000+La+Rochelle" target="_blank" rel="noreferrer">Voir l’itinéraire ↗</a></div></div><div className="contact-detail"><Clock size={20}/><div>Lundi – vendredi <b>08h30 – 18h30</b><br/>Samedi <b>09h00 – 17h00</b><br/>Dimanche fermé</div></div></div><div className="form-card"><h3>Préparons votre projet</h3><p>Rassemblez les informations utiles avant de nous appeler.</p><form ref={formRef} onSubmit={submit} noValidate onChange={() => { setSaved(false); setSaveError(false); }}><label htmlFor="name">Votre nom *</label><input id="name" name="name" autoComplete="name" placeholder="Prénom et nom" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}/>{errors.name && <span id="name-error" className="error">{errors.name}</span>}<label htmlFor="contact-field">Téléphone ou e-mail *</label><input id="contact-field" name="contact" placeholder="Pour vous recontacter" aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'contact-error' : undefined}/>{errors.contact && <span id="contact-error" className="error">{errors.contact}</span>}<label htmlFor="service">Votre type de travaux *</label><select id="service" name="service" defaultValue="" aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined}><option value="" disabled>Sélectionnez une prestation</option>{services.map(s => <option key={s.title}>{s.title}</option>)}<option>Plusieurs travaux / autre projet</option></select>{errors.service && <span id="service-error" className="error">{errors.service}</span>}<label htmlFor="message">Quelques mots sur votre projet *</label><textarea id="message" name="message" rows={3} placeholder="Votre bâtiment, vos besoins, vos envies…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <span id="message-error" className="error">{errors.message}</span>}<p className="form-note">Les informations sont enregistrées pour permettre à ProRenoNeuf de vous recontacter.</p><button className="button copper-bg" type="submit" disabled={sending}>{sending ? 'Enregistrement…' : 'Envoyer ma demande'} <ArrowRight size={18}/></button><div aria-live="polite">{saved && <div className="form-result"><strong>Votre demande a bien été enregistrée.</strong><p>Nous reviendrons vers vous dès que possible.</p><a href="tel:+33687585279">Appeler le 06 87 58 52 79 ↗</a></div>}{saveError && <div className="form-result"><strong>La demande n’a pas pu être enregistrée.</strong><p>Appelez-nous directement pour transmettre votre projet.</p><a href="tel:+33687585279">Appeler le 06 87 58 52 79 ↗</a><button className="text-link" type="button" onClick={download}><Download size={17}/> Télécharger mon récapitulatif</button></div>}</div></form></div></div></section>;
}
