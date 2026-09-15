// ── Configuration ──────────────────────────────────────────────
// IMPORTANT : mets à jour cette URL à chaque redémarrage de ngrok
const API_URL = 'https://cartoon-revoke-music.ngrok-free.dev/api';

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
Office.actions.associate("onNewAppointmentComposeHandler", onNewAppointmentComposeHandler);

function getPublicAssetUrl(fileName) {
  const base = new URL('../', window.location.href);
  return new URL(fileName, base).href;
}

function normalizeTemplateAssets(html) {
  if (!html) return html;
  const logoUrl = getPublicAssetUrl('timsoft-logo.png');
  return html.replace(/src=(['"])(?:\.\.\/|\.\/|\/)?timsoft-logo\.png\1/gi, 'src="' + logoUrl + '"');
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function isFinderCell(row, col) {
  const topLeft = row < 7 && col < 7;
  const topRight = row < 7 && col > 13;
  const bottomLeft = row > 13 && col < 7;
  return topLeft || topRight || bottomLeft;
}

function isFinderDark(row, col) {
  const localRow = row % 14;
  const localCol = col % 14;
  const rr = localRow < 7 ? localRow : localRow - 7;
  const cc = localCol < 7 ? localCol : localCol - 7;
  if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true;
  if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true;
  return false;
}

function buildInlineQrDataUrl(payload) {
  const moduleCount = 21;
  const size = 80;
  const quiet = 2;
  const cell = Math.floor(size / (moduleCount + quiet * 2));
  const total = cell * (moduleCount + quiet * 2);
  const offset = Math.floor((size - total) / 2);
  let seed = hashString(payload);
  let rects = '';

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      let dark;
      if (isFinderCell(row, col)) {
        dark = isFinderDark(row, col);
      } else {
        seed = (1664525 * seed + 1013904223) >>> 0;
        dark = ((seed >>> 28) & 1) === 1;
      }

      if (!dark) continue;
      const x = offset + (col + quiet) * cell;
      const y = offset + (row + quiet) * cell;
      rects += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="#111827"/>';
    }
  }

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" role="img" aria-label="QR">' +
    '<rect width="80" height="80" fill="#ffffff"/>' + rects + '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function buildQrDataUrl(email, name) {
  const parts = name.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'N:' + lastName + ';' + firstName + ';;;',
    'FN:' + name,
    'ORG:Timsoft Group',
    'EMAIL:' + email,
    'URL:https://www.timsoft-group.com',
    'END:VCARD'
  ].join('\n');
  return buildInlineQrDataUrl(vcard);
}

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
      html = normalizeTemplateAssets(html);
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
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '??';

  const qrUrl = buildQrDataUrl(email, name);

  // Remplace toute la balise <img ... {{photoUrl}} ... /> par la vraie photo,
  // ou par un cercle d'initiales si aucune photo n'est disponible (évite l'icône cassée)
  const placeholder = '{{photoUrl}}';
  const idx = html.indexOf(placeholder);

  if (idx !== -1) {
    const tagStart = html.lastIndexOf('<img', idx);
    const tagEnd = html.indexOf('>', idx);
    if (tagStart !== -1 && tagEnd !== -1) {
      let replacement;
      if (photo) {
        const imgTag = html.substring(tagStart, tagEnd + 1);
        replacement = imgTag.split(placeholder).join(photo);
      } else {
        replacement = '<div style="width:65px;height:65px;border-radius:50%;' +
          'background:linear-gradient(135deg,#1a1f5e,#2d3491);display:flex;' +
          'align-items:center;justify-content:center;color:#fff;font-weight:700;' +
          'font-size:22px;">' + initials + '</div>';
      }
      html = html.substring(0, tagStart) + replacement + html.substring(tagEnd + 1);
    }
  }

  return html.split('{{qrCode}}').join(qrUrl);
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

  const qrUrl = buildQrDataUrl(email, name);

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