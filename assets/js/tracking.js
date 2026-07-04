/* ============================================================
   Astec — Tracking (krob-tracking-stack)
   Dispara Lead (GA4 client + server /tracker) no clique de
   qualquer CTA de WhatsApp. Sem Meta — cliente só anuncia no
   Google Ads.
   ============================================================ */

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="api.whatsapp.com"]');
  if (!link) return;

  const eventId = (crypto.randomUUID && crypto.randomUUID()) ||
    (Date.now() + '-' + Math.random().toString(36).slice(2));
  const eventTime = Math.floor(Date.now() / 1000);
  const ctaLabel = link.getAttribute('aria-label') || link.textContent.trim().slice(0, 60);

  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      event_id: eventId,
      cta_label: ctaLabel,
    });
  }

  // Todo CTA de WhatsApp abre em nova aba (target="_blank"), então a página
  // atual não descarrega — sem necessidade de atrasar a navegação.
  fetch('/tracker', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: 'Lead',
      event_id: eventId,
      event_time: eventTime,
      event_source_url: window.location.href,
      user_data: {},
    }),
  }).catch(() => {});
}, { passive: true });
