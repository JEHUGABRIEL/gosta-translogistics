// Envoi d'emails transactionnels via l'API REST de Resend (fetch natif,
// aucun SDK ajouté). Utilisé pour les invitations admin et les codes OTP.

const BRAND = {
  navy: "#0A2540",
  red: "#C2410C",
  sand: "#F5F5F5",
};

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant (voir .env.example).");
  }

  // Tant qu'aucun domaine n'est vérifié sur Resend, l'expéditeur doit rester
  // onboarding@resend.dev (limite du compte gratuit sans domaine à soi).
  const from = process.env.RESEND_FROM_EMAIL ?? "GOSTA TRANS <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Échec de l'envoi d'email (Resend ${res.status}) : ${body}`);
  }

  return res.json();
}

function emailShell(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BRAND.sand};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.sand};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${BRAND.navy};padding:24px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:0.02em;">GOSTA <span style="color:${BRAND.red};">TRANS</span></span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:${BRAND.navy};">
                <h1 style="font-size:18px;margin:0 0 16px;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function inviteEmailHtml({
  acceptUrl,
  invitedByEmail,
}: {
  acceptUrl: string;
  invitedByEmail: string;
}) {
  return emailShell(
    "Invitation au dashboard admin",
    `
    <p style="font-size:14.5px;line-height:1.6;color:#59626E;">
      ${invitedByEmail} vous invite à rejoindre le dashboard admin de GOSTA TRANS Logistique &amp; BTP.
    </p>
    <p style="margin:24px 0;">
      <a href="${acceptUrl}" style="display:inline-block;background:${BRAND.red};color:#ffffff;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;font-size:13px;padding:12px 24px;border-radius:4px;">
        Accepter l'invitation
      </a>
    </p>
    <p style="font-size:12.5px;line-height:1.6;color:#8b96a8;">
      Ce lien expire dans 48 heures. Si vous ne vous attendiez pas à cette invitation, vous pouvez ignorer cet email.
    </p>
    `
  );
}

export function otpEmailHtml({ code }: { code: string }) {
  return emailShell(
    "Confirmez votre adresse email",
    `
    <p style="font-size:14.5px;line-height:1.6;color:#59626E;">
      Voici votre code de confirmation, valable 10 minutes :
    </p>
    <p style="margin:24px 0;font-size:32px;font-weight:800;letter-spacing:0.1em;color:${BRAND.navy};">
      ${code}
    </p>
    <p style="font-size:12.5px;line-height:1.6;color:#8b96a8;">
      Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
    </p>
    `
  );
}
