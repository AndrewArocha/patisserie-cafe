import type { CateringRequest } from "../validators/cateringSchemas.js";
import { CATERING_ADDRESS } from "../config/constants.js";
import type { CateringDecision } from "../models/CateringOrder.js";

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

export function buildCateringRequestEmail(
  details: CateringRequest,
  requestCode: string,
  audience: "staff" | "guest" | CateringDecision = "staff",
  reviewLinks?: { accept: string; reject: string },
) {
  const event = eventNames[details.eventType];
  const date = dateLabel.format(new Date(details.date));
  const time = timeLabel.format(Date.parse(details.startsAt));
  const message = {
    staff: {
      title: "Catering request",
      status: "Pending review",
      followUp: reviewLinks
        ? "Choose Accept or Reject, then send the prefilled email to notify the customer. Use the contact details above if you’d like to discuss the request first."
        : "Reply to this email to contact the guest and let them know whether the request can be approved.",
    },
    guest: {
      title: "We received your catering request",
      status: "Pending review",
      followUp:
        "Our catering team will review your request and email you about availability. Your event is pending approval. Reply to this email with any updates or questions.",
    },
    accepted: {
      title: "Your catering order has been accepted!",
      status: "Confirmed",
      followUp: `We look forward to your ${event.toLowerCase()} at Patisserie Café on ${date} at ${time}. Please keep this confirmation for your records. If you have questions or need to request a change, reach us at contact@patisseriecafe.co. Changes are subject to availability and confirmation by the café.`,
    },
    rejected: {
      title: "An update on your catering request",
      status: "Requested time unavailable",
      followUp:
        "Unfortunately, we’re at full capacity and can’t provide the service at the requested time. We may be able to accommodate a different date or time. Please reply to this email if you’d like to reschedule or modify your order so we can see what’s available.",
    },
  }[audience];
  const { title, status, followUp } = message;
  const phone = details.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "+1 ($1) $2-$3");
  const sections: RequestSection[] = [
    {
      title: "Event details",
      rows: [
        ["Request code", requestCode],
        ["Event type", event],
        ["Requested date (New York)", date],
        ["Requested start time", time],
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
  const actions = reviewLinks
    ? [
        ["Accept", reviewLinks.accept],
        ["Reject", reviewLinks.reject],
      ]
    : [];

  const text = [
    "Patisserie Café",
    title,
    status,
    ...sections.flatMap(({ title, rows }) => [
      "",
      title,
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ]),
    "",
    followUp,
    ...actions.map(([label, url]) => `${label}: ${url}`),
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
              <p style="margin:0 0 5px;color:#28476a;font-size:13px;font-weight:bold;">${status}</p>
              <h1 style="margin:0;color:#192b43;font-family:Georgia,serif;font-size:29px;line-height:1.15;">${title}</h1>
              ${audience !== "staff" ? `<p style="line-height:1.6;">${escapeHtml(followUp)}</p>` : ""}
              ${sections.map(renderSection).join("")}
              ${audience === "staff" ? `<p style="margin:22px 0 0;padding-top:13px;border-top:1px solid #d6e1ec;color:#28476a;font-size:14px;">${followUp}</p>` : ""}
              ${actions.map(([label, url]) => `<a href="${escapeHtml(url)}" style="display:inline-block;margin:12px 8px 0 0;padding:10px 16px;background:#192b43;color:#fff;text-decoration:none;">${label}</a>`).join("")}
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
    subject:
      audience === "staff"
        ? `Catering order #${requestCode} · ${event} · ${details.date}`
        : `[${requestCode}] ${event} · ${title}`,
    replyTo:
      audience === "staff"
        ? reviewLinks
          ? CATERING_ADDRESS
          : details.email
        : audience === "accepted"
          ? "contact@patisseriecafe.co"
          : CATERING_ADDRESS,
    text,
    html,
  };
}
