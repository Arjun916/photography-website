import { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #070707;
    --dark: #0f0e0c;
    --mid: #1a1917;
    --amber: #c8922a;
    --amber-light: #e8b84b;
    --cream: #e8e0d4;
    --muted: #6b6560;
    --white: #f5f0ea;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--cream);
    font-family: 'Cormorant Garamond', serif;
    cursor: none;
    overflow-x: hidden;
  }

  .cursor {
    position: fixed;
    width: 10px; height: 10px;
    background: var(--amber);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease, background 0.2s ease;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1px solid var(--amber);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: all 0.15s ease;
    opacity: 0.5;
  }
  .cursor.hover { width: 18px; height: 18px; background: var(--amber-light); }
  .cursor-ring.hover { width: 58px; height: 58px; opacity: 0.85; }

  .grain {
    position: fixed;
    inset: -200%;
    width: 400%; height: 400%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.032;
    pointer-events: none;
    z-index: 9990;
    animation: grain 0.5s steps(2) infinite;
  }
  @keyframes grain {
    0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-5%)} 20%{transform:translate(-10%,5%)}
    30%{transform:translate(5%,-10%)} 40%{transform:translate(-5%,15%)} 50%{transform:translate(-10%,5%)}
    60%{transform:translate(15%,0%)} 70%{transform:translate(0%,10%)} 80%{transform:translate(-15%,0%)} 90%{transform:translate(10%,5%)}
  }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 56px;
  }
  nav::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(7,7,7,0.97) 0%, transparent 100%);
    z-index: -1;
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.22em;
    color: var(--white);
  }
  .nav-logo span { color: var(--amber); }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--amber); }
  .nav-cta {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--black);
    background: var(--amber);
    padding: 10px 24px;
    text-decoration: none;
    transition: background 0.3s;
  }
  .nav-cta:hover { background: var(--amber-light); }

  /* HERO */
  .hero {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 56px 80px;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, #100c06 0%, #1c1208 35%, #0a0908 70%, #070707 100%);
    z-index: 0;
  }
  .hero-vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, transparent 20%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
  }

  /* Animated aperture */
  .aperture {
    position: absolute;
    top: 50%; right: 8%;
    transform: translateY(-50%);
    width: 420px; height: 420px;
    z-index: 1;
    opacity: 0.06;
  }
  .aperture-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1px solid var(--amber);
    animation: apertureSpin 20s linear infinite;
  }
  .aperture-ring:nth-child(2) { inset: 30px; border-style: dashed; animation-duration: 14s; animation-direction: reverse; }
  .aperture-ring:nth-child(3) { inset: 60px; animation-duration: 25s; }
  .aperture-ring:nth-child(4) { inset: 90px; border-style: dashed; animation-duration: 18s; animation-direction: reverse; }
  .aperture-blade {
    position: absolute;
    top: 50%; left: 50%;
    width: 2px; height: 50%;
    background: linear-gradient(to bottom, transparent, var(--amber));
    transform-origin: top center;
  }
  @keyframes apertureSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .filmstrip-strip {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: repeating-linear-gradient(90deg, var(--amber) 0, var(--amber) 20px, transparent 20px, transparent 30px);
    opacity: 0.15;
    z-index: 2;
  }

  .hero-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 20px;
    position: relative; z-index: 2;
    opacity: 0;
    animation: fadeUp 1s ease 0.2s forwards;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .hero-eyebrow::before {
    content: '';
    width: 40px; height: 1px;
    background: var(--amber);
  }
  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.5rem, 11vw, 13rem);
    line-height: 0.85;
    letter-spacing: 0.015em;
    color: var(--white);
    position: relative; z-index: 2;
    opacity: 0;
    animation: fadeUp 1s ease 0.4s forwards;
  }
  .hero-name .surname {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    color: var(--amber);
    font-size: 0.7em;
    letter-spacing: 0.08em;
  }
  .hero-roles {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 32px;
    position: relative; z-index: 2;
    opacity: 0;
    animation: fadeUp 1s ease 0.7s forwards;
    flex-wrap: wrap;
  }
  .hero-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 20px;
    border-right: 1px solid rgba(200,146,42,0.3);
  }
  .hero-role:first-child { padding-left: 0; }
  .hero-role:last-child { border-right: none; }
  .hero-role.highlight { color: var(--amber); }

  .hero-location {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    position: relative; z-index: 2;
    opacity: 0;
    animation: fadeUp 1s ease 0.9s forwards;
  }
  .hero-location span {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .loc-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--amber);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .hero-scroll {
    position: absolute;
    bottom: 40px; right: 56px;
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
    z-index: 2;
    opacity: 0;
    animation: fadeIn 1s ease 1.4s forwards;
  }
  .hero-scroll span {
    font-family: 'DM Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    writing-mode: vertical-rl;
  }
  .scroll-line {
    width: 1px; height: 64px;
    background: linear-gradient(to bottom, var(--amber), transparent);
    animation: scrollPulse 2.5s ease-in-out infinite;
  }
  @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }

  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  /* SHARED */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .section-label::before { content:''; width:28px; height:1px; background:var(--amber); }

  /* ABOUT */
  #about { padding: 130px 56px; }
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 100px;
    align-items: start;
    margin-top: 60px;
  }
  .about-left h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 3.5vw, 4rem);
    font-weight: 300;
    line-height: 1.2;
    color: var(--white);
    margin-bottom: 36px;
  }
  .about-left h2 em { font-style: italic; color: var(--amber); }
  .about-left p {
    font-size: 1.05rem;
    line-height: 1.95;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 18px;
  }
  .skills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px solid rgba(200,146,42,0.15);
  }
  .skill-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--amber);
    border: 1px solid rgba(200,146,42,0.3);
    padding: 7px 16px;
    transition: background 0.3s, border-color 0.3s;
  }
  .skill-tag:hover { background: rgba(200,146,42,0.08); border-color: var(--amber); }

  .about-right {}
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: rgba(200,146,42,0.08);
    margin-bottom: 40px;
  }
  .stat-box {
    background: var(--dark);
    padding: 40px 32px;
    transition: background 0.3s;
  }
  .stat-box:hover { background: rgba(200,146,42,0.06); }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4rem;
    color: var(--amber);
    line-height: 1;
  }
  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 8px;
  }

  .exp-list { margin-top: 8px; }
  .exp-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 22px 0;
    border-bottom: 1px solid rgba(200,146,42,0.1);
  }
  .exp-item:last-child { border-bottom: none; }
  .exp-role {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--white);
    margin-bottom: 4px;
  }
  .exp-company {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--amber);
  }
  .exp-date {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: var(--muted);
    white-space: nowrap;
    margin-left: 24px;
    margin-top: 2px;
  }

  /* SPECIALIZATIONS */
  #services { padding: 0 56px 130px; }
  .services-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 7.5rem);
    line-height: 0.9;
    letter-spacing: 0.03em;
    color: var(--white);
    margin-bottom: 72px;
  }
  .services-title span { color: var(--amber); }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(200,146,42,0.1);
  }
  .service-card {
    background: var(--black);
    padding: 52px 40px;
    position: relative;
    overflow: hidden;
    transition: background 0.4s;
  }
  .service-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 2px;
    background: var(--amber);
    transition: width 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .service-card:hover::after { width: 100%; }
  .service-card:hover { background: rgba(200,146,42,0.04); }
  .service-icon {
    font-size: 2rem;
    margin-bottom: 28px;
    display: block;
  }
  .service-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: rgba(200,146,42,0.5);
    margin-bottom: 20px;
  }
  .service-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem;
    font-weight: 300;
    color: var(--white);
    margin-bottom: 18px;
    line-height: 1.1;
  }
  .service-desc {
    font-size: 0.9rem;
    line-height: 1.85;
    color: var(--muted);
    font-weight: 300;
  }

  /* WORK / PROJECTS */
  #work { padding: 130px 56px; background: var(--dark); position: relative; }
  #work::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }
  .work-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 72px;
  }
  .work-header h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 6vw, 7.5rem);
    line-height: 0.9;
    letter-spacing: 0.03em;
    color: var(--white);
  }
  .work-header p {
    max-width: 260px;
    font-style: italic;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.7;
    text-align: right;
  }
  .projects-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 2px;
  }
  .project-card {
    position: relative;
    overflow: hidden;
    cursor: none;
    background: var(--mid);
  }
  .project-card:first-child { grid-row: 1 / 3; }
  .project-card:first-child { aspect-ratio: 3/4; }
  .project-card:not(:first-child) { aspect-ratio: 16/9; }
  .proj-bg {
    position: absolute; inset: 0;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .project-card:hover .proj-bg { transform: scale(1.07); }
  .proj-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
  }
  .proj-info {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 32px 36px;
    transform: translateY(6px);
    transition: transform 0.4s ease;
  }
  .project-card:hover .proj-info { transform: translateY(0); }
  .proj-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 10px;
  }
  .proj-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 2.2vw, 2.5rem);
    font-weight: 300;
    color: var(--white);
    line-height: 1.1;
  }
  .proj-detail {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: var(--muted);
    margin-top: 10px;
    letter-spacing: 0.1em;
    opacity: 0;
    transition: opacity 0.4s ease 0.1s;
  }
  .project-card:hover .proj-detail { opacity: 1; }

  /* REEL CTA */
  #reel {
    padding: 140px 56px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--black);
  }
  .reel-bg-text {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 16vw, 20rem);
    color: transparent;
    -webkit-text-stroke: 1px rgba(200,146,42,0.05);
    white-space: nowrap;
    pointer-events: none;
    letter-spacing: 0.1em;
  }
  .reel-inner { position: relative; z-index: 1; }
  .reel-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 10rem);
    letter-spacing: 0.06em;
    color: var(--white);
    line-height: 0.9;
    margin-bottom: 28px;
  }
  .reel-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--amber); font-size: 0.7em; }
  .reel-sub {
    font-style: italic;
    color: var(--muted);
    font-size: 1.1rem;
    margin-bottom: 64px;
    line-height: 1.7;
  }
  .reel-actions { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 18px 52px;
    background: var(--amber);
    color: var(--black);
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: none;
    transition: background 0.3s;
    font-weight: 400;
  }
  .btn-primary:hover { background: var(--amber-light); }
  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 18px 52px;
    border: 1px solid rgba(200,146,42,0.4);
    color: var(--amber);
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: none;
    transition: border-color 0.3s, background 0.3s;
  }
  .btn-outline:hover { border-color: var(--amber); background: rgba(200,146,42,0.06); }
  .play-tri {
    width: 0; height: 0;
    border-style: solid;
    border-width: 5px 0 5px 9px;
    border-color: transparent transparent transparent currentColor;
  }

  /* CONTACT */
  #contact { padding: 140px 56px; }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    margin-top: 60px;
    align-items: start;
  }
  .contact-left h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 4vw, 5rem);
    font-weight: 300;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: 28px;
  }
  .contact-left h2 em { font-style: italic; color: var(--amber); }
  .contact-left p {
    font-size: 1rem;
    line-height: 1.9;
    color: var(--muted);
    font-style: italic;
    margin-bottom: 48px;
  }
  .contact-email-link {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.1rem, 2vw, 1.6rem);
    color: var(--white);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    transition: color 0.3s;
    border-bottom: 1px solid rgba(200,146,42,0.15);
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .contact-email-link:hover { color: var(--amber); }
  .contact-email-link span.lbl {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--amber);
    flex-shrink: 0;
  }
  .contact-right {}
  .avail-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #4caf50;
    border: 1px solid rgba(76,175,80,0.3);
    padding: 10px 20px;
    margin-bottom: 48px;
  }
  .avail-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4caf50;
    animation: pulse 2s ease-in-out infinite;
  }
  .contact-info-list { margin-bottom: 52px; }
  .contact-info-row {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 18px 0;
    border-bottom: 1px solid rgba(200,146,42,0.08);
  }
  .ci-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--amber);
    width: 80px;
    flex-shrink: 0;
  }
  .ci-value {
    font-size: 0.95rem;
    color: var(--cream);
  }
  .social-row {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
  }
  .social-link {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .social-link::before { content: '↗'; font-size: 0.7em; }
  .social-link:hover { color: var(--amber); }

  /* FOOTER */
  footer {
    border-top: 1px solid rgba(200,146,42,0.1);
    padding: 32px 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer p {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: var(--muted);
  }
  .footer-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 0.22em;
    color: var(--white);
  }
  .footer-logo span { color: var(--amber); }

  /* Responsive */
  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .hero { padding: 0 24px 60px; }
    #about, #services, #work, #reel, #contact { padding-left: 24px; padding-right: 24px; }
    .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 52px; }
    .services-grid { grid-template-columns: 1fr; }
    .projects-grid { grid-template-columns: 1fr; }
    .project-card:first-child { grid-row: auto; aspect-ratio: 16/9; }
    footer { flex-direction: column; gap: 16px; text-align: center; }
    .aperture { display: none; }
  }
`;

const experiences = [
  { role: "Cinematographer", company: "Hajjo Group", date: "Feb 2026 – Present", location: "Dubai, UAE" },
  { role: "Cinematographer & Video Editor", company: "Sterling Parfums Industries LLC", date: "Sep 2025 – Feb 2026", location: "Dubai, UAE" },
  { role: "Senior Content Producer", company: "Kreative Clan", date: "May 2025 – Oct 2025", location: "Bengaluru, India" },
  { role: "Video Specialist / Freelance Creator", company: "Kreative Clan + Freelance", date: "Jun 2020 – Oct 2025", location: "India" },
];

const services = [
  { num: "01", icon: "🎬", name: "Cinematography", desc: "Cinematic visual storytelling across commercials, luxury brands, weddings, events, and automotive. Every frame composed with intention — light, angle, and motion working as one." },
  { num: "02", icon: "✂️", name: "Video Editing", desc: "Post-production from raw footage to polished final cut. Rhythm, pacing, and narrative flow crafted through meticulous editing with Adobe Premiere Pro and After Effects." },
  { num: "03", icon: "🎯", name: "Creative Direction", desc: "End-to-end visual strategy for brands and businesses. From concept to screen — scripting, storyboarding, shooting, and delivering content that builds digital presence." },
  { num: "04", icon: "📸", name: "Photography", desc: "Commercial and lifestyle photography with a cinematic eye. Luxury resorts, product campaigns, and events captured with precision and aesthetic depth." },
  { num: "05", icon: "🤖", name: "AI Content Creation", desc: "Pioneering the blend of cinematic thinking with AI-powered visuals using tools like Higgsfield and Freepik — where creative vision meets emerging technology." },
  { num: "06", icon: "🎵", name: "Branded & Event Content", desc: "Concerts, corporate events, and brand activations brought to life through dynamic storytelling. Full-service coverage across India, Dubai, and international destinations." },
];

const projects = [
  {
    title: "Fruits of Tradition",
    tag: "Documentary · Cinematography & Edit",
    detail: "Travel documentary shot in Ladakh, India · Adobe Premiere Pro",
    gradient: "linear-gradient(160deg, #0d1a2a 0%, #1a2d0f 50%, #0a0f1a 100%)",
    featured: true,
  },
  {
    title: "Sterling Perfumes Campaigns",
    tag: "Commercial · Brand Content",
    detail: "Perfume campaigns & advertisements · Dubai, UAE",
    gradient: "linear-gradient(135deg, #1a0f05 0%, #2a1a08 60%, #0f0a0a 100%)",
  },
  {
    title: "AI Cinematic Series",
    tag: "AI Content · Higgsfield & Freepik",
    detail: "Experimental AI video project · 2024",
    gradient: "linear-gradient(135deg, #050a1a 0%, #0a051a 50%, #1a0510 100%)",
  },
];

const skills = [
  "Film Production", "Cinematography", "Video Editing", "Creative Direction",
  "Documentaries", "Content Creation", "Photography", "Adobe Premiere Pro",
  "After Effects", "Scripting", "Branded Content", "AI Content", "Automotive", "Luxury Resorts"
];

export default function App() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.left = e.clientX + "px";
          ringRef.current.style.top = e.clientY + "px";
        }
      }, 60);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("a, button, .project-card, .service-card, .stat-box, .skill-tag");
    const on = () => setHovering(true);
    const off = () => setHovering(false);
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      <div className="grain" />
      <div ref={cursorRef} className={`cursor ${hovering ? "hover" : ""}`} />
      <div ref={ringRef} className={`cursor-ring ${hovering ? "hover" : ""}`} />

      {/* NAV */}
      <nav>
        <div className="nav-logo">SAIKIRAN<span>.</span></div>
        <ul className="nav-links">
          {[["#about", "About"], ["#work", "Work"], ["#services", "Services"], ["#contact", "Contact"]].map(([href, label]) => (
            <li key={label}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="https://saikiranvsfilms.my.canva.site" target="_blank" rel="noopener noreferrer" className="nav-cta">
          Portfolio ↗
        </a>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-vignette" />

        {/* Aperture decoration */}
        <div className="aperture">
          <div className="aperture-ring" />
          <div className="aperture-ring" />
          <div className="aperture-ring" />
          <div className="aperture-ring" />
          {[0,45,90,135,180,225,270,315].map(deg => (
            <div className="aperture-blade" key={deg} style={{ transform: `translateX(-50%) rotate(${deg}deg)` }} />
          ))}
        </div>
        <div className="filmstrip-strip" />

        <div className="hero-eyebrow">Filmmaker · Cinematographer · Editor</div>
        <h1 className="hero-name">
          SAIKIRAN
          <span className="surname">VS Nambiar</span>
        </h1>
        <div className="hero-roles">
          <span className="hero-role highlight">DP</span>
          <span className="hero-role">Video Editor</span>
          <span className="hero-role">Creative Director</span>
          <span className="hero-role">Content Creator</span>
          <span className="hero-role">Photographer</span>
        </div>
        <div className="hero-location">
          <div className="loc-dot" />
          <span>Based in Dubai, UAE · Working Globally · 6+ Years</span>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-label">About Me</div>
        <div className="about-grid">
          <div className="about-left">
            <h2>Filmmaker. Engineer.<br /><em>Visual Storyteller.</em></h2>
            <p>I'm Saikiran VS, a filmmaker, cinematographer, and video editor with 6+ years of experience in visual storytelling. With a background in engineering, I bring a strong technical mindset to every project — blending creativity with precision.</p>
            <p>I specialize in cinematic content across commercials, branded content, luxury resorts, events, weddings, automotive, concerts, and social media — currently based in the UAE, with projects across India, Dubai, and international destinations.</p>
            <p>I'm also at the forefront of AI content creation, exploring the intersection of cinematic thinking and generative visual tools.</p>
            <div className="skills-wrap">
              {skills.map(s => <span className="skill-tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="about-right">
            <div className="stats-grid">
              {[
                { n: "6+", l: "Years of Experience" },
                { n: "3", l: "Countries" },
                { n: "∞", l: "Stories Told" },
                { n: "47+", l: "Projects Delivered" },
              ].map(s => (
                <div className="stat-box" key={s.l}>
                  <div className="stat-num">{s.n}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="section-label" style={{ marginBottom: "8px" }}>Experience</div>
            <div className="exp-list">
              {experiences.map(e => (
                <div className="exp-item" key={e.role + e.company}>
                  <div>
                    <div className="exp-role">{e.role}</div>
                    <div className="exp-company">{e.company} · {e.location}</div>
                  </div>
                  <div className="exp-date">{e.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="section-label">What I Do</div>
        <div className="services-title">SPECIALIZ<span>ATIONS</span></div>
        <div className="services-grid">
          {services.map(s => (
            <div className="service-card" key={s.num}>
              <div className="service-num">{s.num}</div>
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work">
        <div className="work-header">
          <div>
            <div className="section-label">Selected Works</div>
            <h2>THE WORK</h2>
          </div>
          <p>A selection of films, commercials, and branded stories from across India & the UAE.</p>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={i}>
              <div className="proj-bg" style={{ background: p.gradient, position: 'absolute', inset: 0 }} />
              <div className="proj-overlay" />
              <div className="proj-info">
                <div className="proj-tag">{p.tag}</div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-detail">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REEL CTA */}
      <section id="reel">
        <div className="reel-bg-text">SHOWREEL</div>
        <div className="reel-inner">
          <div className="section-label" style={{ justifyContent: "center" }}>Saikiran VS Films</div>
          <div className="reel-title">
            VIEW THE<br />
            <em>Portfolio</em>
          </div>
          <p className="reel-sub">
            6 years. Three countries. One cinematic vision.<br />
            Commercials, documentaries, brands, and beyond.
          </p>
          <div className="reel-actions">
            <a href="https://saikiranvsfilms.my.canva.site" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <div className="play-tri" />
              <span>View Full Portfolio</span>
            </a>
            <a href="#contact" className="btn-outline">
              <span>Get In Touch</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-label">Contact</div>
        <div className="contact-grid">
          <div className="contact-left">
            <h2>Let's create something <em>extraordinary</em></h2>
            <p>Open for freelance projects, brand collaborations, and long-term creative partnerships. Always excited to work on impactful stories and ambitious ideas.</p>
            <a href="mailto:saikiran@example.com" className="contact-email-link">
              <span className="lbl">Email</span>
              saikiran@example.com
            </a>
            <a href="https://saikiranvsfilms.my.canva.site" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-flex' }}>
              <span>View Portfolio ↗</span>
            </a>
          </div>
          <div className="contact-right">
            <div className="avail-badge">
              <div className="avail-dot" />
              Available for Projects
            </div>
            <div className="contact-info-list">
              {[
                { lbl: "Location", val: "Dubai, UAE" },
                { lbl: "Role", val: "Cinematographer at Hajjo Group" },
                { lbl: "Open to", val: "Freelance · Collabs · Partnerships" },
                { lbl: "Markets", val: "India · UAE · International" },
              ].map(r => (
                <div className="contact-info-row" key={r.lbl}>
                  <span className="ci-label">{r.lbl}</span>
                  <span className="ci-value">{r.val}</span>
                </div>
              ))}
            </div>
            <div className="social-row">
              <a href="https://www.linkedin.com/in/saikiran-vs-nambiar" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
              <a href="https://saikiranvsfilms.my.canva.site" target="_blank" rel="noopener noreferrer" className="social-link">Portfolio</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2024 Saikiran VS Nambiar. All rights reserved.</p>
        <div className="footer-logo">SAIKIRAN<span>.</span></div>
        <p>Dubai, UAE · Filmmaker & DP</p>
      </footer>
    </>
  );
}
