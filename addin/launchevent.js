// frontend-angular/public/addin/launchevent.js

const API_URL = 'https://timsoft-signature-api-a0g4gseddgccarc4.francecentral-01.azurewebsites.net/api';

async function onNewMessageComposeHandler(event) {
  try {
    const userEmail = Office.context.mailbox.userProfile.emailAddress;

    const response = await fetch(
      `${API_URL}/Signatures/by-email/${encodeURIComponent(userEmail)}/active`
    );

    if (response.ok) {
      const data = await response.json();

      Office.context.mailbox.item.body.setSignatureAsync(
        data.generatedHtml,
        { coercionType: Office.CoercionType.Html },
        function() { event.completed(); }
      );
    } else {
      event.completed();
    }
  } catch(e) {
    event.completed();
  }
}

function onNewAppointmentComposeHandler(event) {
  event.completed();
}