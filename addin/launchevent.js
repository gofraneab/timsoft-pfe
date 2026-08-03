// ── Configuration ──────────────────────────────────────────────
// IMPORTANT : mets à jour cette URL à chaque redémarrage de ngrok
const API_URL = 'https://cartoon-revoke-music.ngrok-free.dev/api';

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
Office.actions.associate("onNewAppointmentComposeHandler", onNewAppointmentComposeHandler);

function onNewAppointmentComposeHandler(event) {
  event.completed();
}

async function onNewMessageComposeHandler(event) {
  try {
    const userEmail = Office.context.mailbox.userProfile.emailAddress;
    const userName  = Office.context.mailbox.userProfile.displayName || '';

    // 1. Essaie de récupérer le VRAI template créé dans le Dashboard
    let html = await fetchSignatureFromDashboard(userEmail);

    if (html) {
      // 2. Injecte photo + QR dans les placeholders {{photoUrl}} / {{qrCode}} du template
      html = await injectPhotoAndQr(html, userEmail, userName);
    } else {
      // 3. Fallback générique SEULEMENT si le Dashboard est injoignable
      //    ou si l'utilisateur/département n'existe pas encore en base
      html = await buildFallbackSignature(userEmail, userName);
    }

    Office.context.mailbox.item.body.setSignatureAsync(
      html,
      { coercionType: Office.CoercionType.Html },
      function() { event.completed(); }
    );
  } catch (e) {
    event.completed();
  }
}

// ── Récupère le template ACTIF du département depuis le Dashboard ──
async function fetchSignatureFromDashboard(email) {
  const url = API_URL + '/Signatures/by-email/' + encodeURIComponent(email) + '/active';
  try {
    const res = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.generatedHtml || null;
  } catch (e) {
    return null;
  }
}

// ── Remplace {{photoUrl}} et {{qrCode}} dans le HTML reçu du Dashboard ──
async function injectPhotoAndQr(html, email, name) {
  const photo = await getCachedOrFetchPhoto(email);
  const parts = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';

  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:' + lastName + ';' + firstName + ';;;',
    'FN:' + name,
    'ORG:Timsoft Group',
    'EMAIL:' + email,
    'URL:https://www.timsoft-group.com',
    'END:VCARD'
  ].join('\n');
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + encodeURIComponent(vcard);

  return html
    .split('{{photoUrl}}').join(photo || '')
    .split('{{qrCode}}').join(qrUrl);
}

// ── Fallback : signature générique construite localement ──
async function buildFallbackSignature(email, name) {
  const parts     = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '??';

  const photo = await getCachedOrFetchPhoto(email);

  const photoEl = photo
    ? '<img src="' + photo + '" width="65" height="65" style="border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;display:block;" alt="' + name + '"/>'
    : '<div style="width:65px;height:65px;border-radius:50%;background:linear-gradient(135deg,#1a1f5e,#2d3491);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:22px;">' + initials + '</div>';

  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:' + lastName + ';' + firstName + ';;;',
    'FN:' + name,
    'ORG:Timsoft Group',
    'EMAIL:' + email,
    'URL:https://www.timsoft-group.com',
    'END:VCARD'
  ].join('\n');
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + encodeURIComponent(vcard);

  return '<table style="font-family:Segoe UI,Arial,sans-serif;border-collapse:collapse;max-width:540px;">' +
    '<tr>' +
      '<td style="padding-right:16px;vertical-align:middle;">' + photoEl + '</td>' +
      '<td style="padding:0 16px;vertical-align:middle;border-left:3px solid #1a1f5e;">' +
        '<p style="margin:0 0 3px;font-size:16px;font-weight:700;color:#1a1f5e;">' + firstName + ' ' + lastName + '</p>' +
        '<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">Timsoft Group</p>' +
        '<p style="margin:0 0 3px;font-size:12px;color:#374151;">&#9993;&nbsp;<a href="mailto:' + email + '" style="color:#374151;text-decoration:none;">' + email + '</a></p>' +
        '<p style="margin:5px 0 0;font-size:12px;"><a href="https://www.timsoft-group.com" style="color:#1a1f5e;font-weight:600;text-decoration:none;">www.timsoft-group.com</a></p>' +
      '</td>' +
      '<td style="padding-left:16px;vertical-align:middle;text-align:center;">' +
        '<img src="' + qrUrl + '" width="80" height="80" alt="QR Code" style="border:1px solid #e5e7eb;border-radius:8px;display:block;"/>' +
        '<p style="margin:5px 0 0;font-size:9px;color:#9ca3af;line-height:1.4;">Scanner pour<br>ajouter le contact</p>' +
      '</td>' +
    '</tr>' +
  '</table>';
}

// ── Photo Outlook avec cache localStorage (partagé avec index.html, même origine) ──
function getCachedOrFetchPhoto(email) {
  return new Promise((resolve) => {
    try {
      const cached = localStorage.getItem('timsoft_photo_' + email);
      if (cached) return resolve(cached);
    } catch (e) {}

    const timer = setTimeout(() => resolve(null), 2500);

    try {
      Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, async function(result) {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          clearTimeout(timer);
          return resolve(null);
        }

        const token   = result.value;
        const restUrl = Office.context.mailbox.restUrl || 'https://outlook.office.com/api';

        try {
          const res = await fetch(restUrl + '/v2.0/me/photo/$value', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          clearTimeout(timer);

          if (res.ok) {
            const blob = await res.blob();
            if (blob.size > 0) {
              const reader = new FileReader();
              reader.onloadend = function() {
                try { localStorage.setItem('timsoft_photo_' + email, reader.result); } catch (e) {}
                resolve(reader.result);
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          clearTimeout(timer);
          resolve(null);
        }
      });
    } catch (e) {
      clearTimeout(timer);
      resolve(null);
    }
  });
}