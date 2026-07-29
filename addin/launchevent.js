// ── LaunchEvent handlers — s'exécutent automatiquement à l'ouverture d'un nouveau message ──

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
Office.actions.associate("onNewAppointmentComposeHandler", onNewAppointmentComposeHandler);

function onNewAppointmentComposeHandler(event) {
  event.completed();
}

async function onNewMessageComposeHandler(event) {
  try {
    const userEmail = Office.context.mailbox.userProfile.emailAddress;
    const userName  = Office.context.mailbox.userProfile.displayName || '';
    const parts      = userName.trim().split(' ');
    const firstName  = parts[0] || '';
    const lastName   = parts.slice(1).join(' ') || '';
    const initials   = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '??';

    const photoUrl = await getCachedOrFetchPhoto(userEmail);

    const photoEl = photoUrl
      ? `<img src="${photoUrl}" width="65" height="65"
           style="border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;display:block;"
           alt="${userName}"/>`
      : `<div style="width:65px;height:65px;border-radius:50%;
           background:linear-gradient(135deg,#1a1f5e,#2d3491);
           display:flex;align-items:center;justify-content:center;
           color:#fff;font-weight:700;font-size:22px;">${initials}</div>`;

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + lastName + ';' + firstName + ';;;',
      'FN:' + firstName + ' ' + lastName,
      'ORG:Timsoft Group',
      'EMAIL:' + userEmail,
      'URL:https://www.timsoft-group.com',
      'END:VCARD'
    ].join('\n');
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + encodeURIComponent(vcard);

    const html = `
<table style="font-family:Segoe UI,Arial,sans-serif;border-collapse:collapse;max-width:540px;">
  <tr>
    <td style="padding-right:16px;vertical-align:middle;">
      ${photoEl}
    </td>
    <td style="padding:0 16px;vertical-align:middle;border-left:3px solid #1a1f5e;">
      <p style="margin:0 0 3px;font-size:16px;font-weight:700;color:#1a1f5e;">
        ${firstName} ${lastName}
      </p>
      <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
        Timsoft Group
      </p>
      <p style="margin:0 0 3px;font-size:12px;color:#374151;">
        &#9993;&nbsp;<a href="mailto:${userEmail}" style="color:#374151;text-decoration:none;">${userEmail}</a>
      </p>
      <p style="margin:5px 0 0;font-size:12px;">
        <a href="https://www.timsoft-group.com" style="color:#1a1f5e;font-weight:600;text-decoration:none;">
          www.timsoft-group.com
        </a>
      </p>
    </td>
    <td style="padding-left:16px;vertical-align:middle;text-align:center;">
      <img src="${qrUrl}" width="80" height="80" alt="QR Code"
        style="border:1px solid #e5e7eb;border-radius:8px;display:block;"/>
      <p style="margin:5px 0 0;font-size:9px;color:#9ca3af;line-height:1.4;">
        Scanner pour<br>ajouter le contact
      </p>
    </td>
  </tr>
</table>`;

    Office.context.mailbox.item.body.setSignatureAsync(
      html,
      { coercionType: Office.CoercionType.Html },
      function() {
        event.completed();
      }
    );
  } catch (e) {
    // En cas d'échec, on ne bloque jamais la composition du message
    event.completed();
  }
}

// ── Photo Outlook avec cache localStorage (partagé avec index.html, même origine) ──
function getCachedOrFetchPhoto(email) {
  return new Promise((resolve) => {
    try {
      const cached = localStorage.getItem('timsoft_photo_' + email);
      if (cached) return resolve(cached);
    } catch (e) {}

    // Timeout court : ne pas ralentir l'ouverture du nouveau message
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