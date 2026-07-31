// Cloudflare Pages Function - intercepts requests for
// /case-studies/private-equity-platforms.html.
//
// The real case-study markup lives in ../_content/private-equity-platforms.js,
// which is never part of the public/ static output, so it can only reach a
// visitor's browser through this function, and only after the passcode
// posted here matches env.PEP_PASSCODE (a Cloudflare secret, set in the
// Pages project dashboard - never committed to the repo).
//
// No session/cookie is issued: every request is checked fresh, so a
// reload or a new visit always asks for the passcode again.

import { html as pageHtml } from '../_content/private-equity-platforms.js';

function loginPage(showError) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Locked - Shichi Upadhyay</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/styles/main.css">
</head>
<body class="cs-page pep">
  <header class="nav">
    <div class="wrap">
      <div class="brand"><a href="/index.html">Shichi Upadhyay</a></div>
    </div>
  </header>
  <section class="cs-section cs-glance">
    <div class="wrap" style="max-width: 420px;">
      <div class="shead"><h2>This case study is locked</h2></div>
      <p style="color: var(--ink-soft); margin-bottom: 20px;">Enter the passcode to view it.</p>
      <form method="POST" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <input type="password" name="passcode" placeholder="Passcode" autocomplete="off" autofocus
          style="flex: 1; min-width: 160px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 4px; font-family: 'Geist Mono', monospace; background: var(--card); color: var(--ink);">
        <button type="submit" class="view-btn" style="flex: none;">Unlock</button>
      </form>
      ${showError ? '<p style="color: var(--amber); margin-top: 12px; font-size: .9rem;">Incorrect passcode - try again.</p>' : ''}
    </div>
  </section>
</body>
</html>`;
}

export async function onRequestGet() {
  return new Response(loginPage(false), {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const passcode = form.get('passcode');

  if (passcode && env.PEP_PASSCODE && passcode === env.PEP_PASSCODE) {
    return new Response(pageHtml, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  }

  return new Response(loginPage(true), {
    status: 401,
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}
