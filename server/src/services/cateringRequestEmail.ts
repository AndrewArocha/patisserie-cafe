import type { CateringRequest } from "../validators/cateringSchemas.js";
import { CATERING_ADDRESS } from "../config/constants.js";

const storefront = "https://www.patisseriecafe.co";
const eventNames = {
  private: "Private room rental",
  corporate: "Corporate room rental",
  "full-service": "Full-service catering",
};
const dateLabel = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "UTC" });
const timeLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});
const htmlCharacters: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlCharacters[character]);
}

type RequestSection = { title: string; rows: Array<[string, string]> };

function renderSection({ title, rows }: RequestSection) {
  const cells = rows
    .map(
      ([label, value]) => `
      <tr>
        <th scope="row" width="36%" style="padding:10px 12px;border-bottom:1px solid #d6e1ec;background:#f1f5fa;text-align:left;vertical-align:top;color:#28476a;font-size:14px;">${label}</th>
        <td style="padding:10px 12px;border-bottom:1px solid #d6e1ec;vertical-align:top;overflow-wrap:anywhere;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `
    <h2 style="margin:23px 0 9px;color:#192b43;font-size:16px;">${title}</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:2px solid #28476a;border-left:1px solid #d6e1ec;border-right:1px solid #d6e1ec;">
      ${cells}
    </table>`;
}

export function buildCateringRequestEmail(details: CateringRequest, audience: "staff" | "guest" = "staff") {
  const forGuest = audience === "guest";
  const title = forGuest ? "We received your catering request" : "Catering request";
  const event = eventNames[details.eventType];
  const date = dateLabel.format(new Date(details.date));
  const phone = details.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "+1 ($1) $2-$3");
  const sections: RequestSection[] = [
    {
      title: "Event details",
      rows: [
        ["Event type", event],
        ["Requested date (New York)", date],
        ["Requested start time", timeLabel.format(Date.parse(details.startsAt))],
        ["Guest count", String(details.guests)],
      ],
    },
    {
      title: "Customer contact",
      rows: [
        ["Name", details.name],
        ["Phone", phone],
        ["Email", details.email],
      ],
    },
    {
      title: "Service selections",
      rows:
        details.eventType === "full-service"
          ? [["Requested services", details.services.join(", ") || "None selected"]]
          : [
              ["Refreshments", details.refreshment ?? "None requested"],
              ["Audio visual", details.audioVisual ? "Requested" : "Not requested"],
            ],
    },
  ];
  const followUp = forGuest
    ? "Our catering team will review your request and email you about availability. Your event is pending approval. Reply to this email with any updates or questions."
    : "Reply to this email to contact the guest and let them know whether the request can be approved.";

  const text = [
    "Patisserie Café",
    title,
    "Availability pending",
    ...sections.flatMap(({ title, rows }) => [
      "",
      title,
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ]),
    "",
    followUp,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Patisserie Café</title>
</head>
<body style="margin:0;padding:0;background:#f3eee6;color:#192b43;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f3eee6">
    <tr>
      <td align="center" style="padding:18px 10px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:600px;border-top:6px solid #192b43;border-bottom:4px solid #192b43;">
          <tr>
            <td style="padding:16px 20px;background:#fbf8f3;border-bottom:2px solid #28476a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:12px;">
                    <img src="${storefront}/images/patisserie-logo.png" alt="" width="48" style="display:block;width:48px;height:auto;margin-bottom:5px;">
                    <span style="color:#192b43;font-family:Georgia,serif;font-size:19px;">Patisserie Café</span>
                  </td>
                  <td align="right" valign="middle">
                    <img src="${storefront}/images/patisserie-storefront.jpg" alt="Patisserie Café storefront" width="124" style="display:block;width:124px;max-width:100%;height:auto;border:1px solid #d6e1ec;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:19px 20px 24px;">
              <p style="margin:0 0 5px;color:#28476a;font-size:13px;font-weight:bold;">Availability pending</p>
              <h1 style="margin:0;color:#192b43;font-family:Georgia,serif;font-size:29px;line-height:1.15;">${title}</h1>
              ${sections.map(renderSection).join("")}
              <p style="margin:22px 0 0;padding-top:13px;border-top:1px solid #d6e1ec;color:#28476a;font-size:14px;">${followUp}</p>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${title} · ${event} · ${details.date}`,
    replyTo: forGuest ? CATERING_ADDRESS : details.email,
    text,
    html,
  };
}
