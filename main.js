/**
 * main.js — Rishabh Mer AI Portfolio
 * Three.js (UMD global) + GSAP + Lenis + Typed.js + tsParticles + VanillaTilt
 * Works on file:// (double-click) AND served via HTTP (GitHub Pages)
 */

// THREE is a global from three.min.js loaded before this script
/* global THREE, gsap, ScrollTrigger, Lenis, Typed, VanillaTilt, tsParticles */

/* ================================================================
   DEVICE / PERFORMANCE DETECTION
   ================================================================ */
const isMobile    = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
const isLowPower  = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ENABLE_3D   = !isMobile && !isLowPower && !reduceMotion;

/* ================================================================
   LOADER
   ================================================================ */
function initLoader() {
  const loader    = document.getElementById('loader');
  const fillEl    = document.getElementById('loaderFill');
  if (!loader) return;

  let progress = 0;
  const step = () => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    fillEl.style.width = progress + '%';

    if (progress < 100) {
      setTimeout(step, 80 + Math.random() * 80);
    } else {
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  };
  step();
}

/* ================================================================
   LENIS SMOOTH SCROLL
   ================================================================ */
function initLenis() {
  if (reduceMotion) return;

  const lenis = new Lenis({
    duration:    1.2,
    easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction:   'vertical',
    smooth:      true,
    smoothTouch: false,
  });

  // Sync with GSAP ticker
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links → Lenis scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -70 });
    });
  });
}

/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100).toFixed(2) + '%';
  }, { passive: true });
}

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */
function initCursor() {
  if (isMobile) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  const tick = () => {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(tick);
  };
  tick();

  // Hover state
  const hoverTargets = 'a, button, .flip-wrap, .cert-card, input, textarea, .proj-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ================================================================
   NAVBAR — scroll shrink + active section highlight
   ================================================================ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  // Scroll shrink
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ================================================================
   THEME TOGGLE
   ================================================================ */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const stored = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ================================================================
   TYPED.JS — hero subtitle
   ================================================================ */
function initTyped() {
  const el = document.getElementById('heroTyped');
  if (!el || typeof Typed === 'undefined') return;

  new Typed('#heroTyped', {
    strings: [
      'RAG pipelines',
      'neural networks',
      'LLM fine-tuned models',
      'agentic AI systems',
      'vector search engines',
      'production ML systems',
    ],
    typeSpeed:     45,
    backSpeed:     25,
    backDelay:     2200,
    startDelay:    800,
    loop:          true,
    showCursor:    false,
  });
}

/* ================================================================
   STAT COUNTERS (GSAP)
   ================================================================ */
function initCounters() {
  document.querySelectorAll('.stat-counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start:   'top 90%',
      once:    true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val:      target,
          duration: 1.8,
          ease:     'power2.out',
          onUpdate() {
            el.textContent = Math.round(this.targets()[0].val);
          },
        });
      },
    });
  });
}

/* ================================================================
   GSAP SCROLL ANIMATIONS
   ================================================================ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Generic fade-up for section headers
  gsap.utils.toArray('[data-anim="fadeUp"]').forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  // Fade right
  gsap.utils.toArray('[data-anim="fadeRight"]').forEach(el => {
    gsap.fromTo(el,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  // Fade left
  gsap.utils.toArray('[data-anim="fadeLeft"]').forEach(el => {
    gsap.fromTo(el,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  // Flip cards stagger
  gsap.utils.toArray('.flip-wrap').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0, scale: 0.94 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.7, ease: 'power3.out',
        delay: (i % 3) * 0.12,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }
    );
  });

  // Cert cards stagger
  gsap.utils.toArray('.cert-card').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6, ease: 'power3.out',
        delay: (i % 3) * 0.1,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      }
    );
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  // Tech pills stagger
  ScrollTrigger.create({
    trigger: '.stack-cats',
    start:   'top 80%',
    once:    true,
    onEnter: () => {
      gsap.fromTo('.pill',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.035, ease: 'back.out(1.7)' }
      );
    },
  });

  // Hero section parallax for canvas
  if (ENABLE_3D) {
    gsap.to('#heroCanvas', {
      yPercent:      20,
      ease:          'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ================================================================
   MOBILE FLIP CARD — click to toggle
   ================================================================ */
function initFlipCards() {
  if (!isMobile) return; // hover handles desktop

  document.querySelectorAll('.flip-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => wrap.classList.toggle('flipped'));
  });
}

/* ================================================================
   VANILLA TILT — cert cards only
   ================================================================ */
function initTilt() {
  if (isMobile || typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max:       10,
    speed:     400,
    glare:     true,
    'max-glare': 0.15,
    scale:     1.02,
  });
}

/* ================================================================
   TSPARTICLES — ambient hero background
   ================================================================ */
async function initParticles() {
  if (typeof tsParticles === 'undefined') return;

  await tsParticles.load('tsparticles', {
    fullScreen:  { enable: false },
    background:  { color: { value: 'transparent' } },
    fpsLimit:    60,
    particles: {
      number:  { value: ENABLE_3D ? 55 : 30, density: { enable: true, area: 900 } },
      color:   { value: ['#00d4ff', '#7c3aed', '#ec4899'] },
      shape:   { type: 'circle' },
      opacity: { value: { min: 0.05, max: 0.3 }, animation: { enable: true, speed: 0.6, sync: false } },
      size:    { value: { min: 1, max: 2.5 } },
      links: {
        enable:   true,
        color:    '#00d4ff',
        opacity:  0.08,
        distance: 160,
        width:    1,
      },
      move: {
        enable:    true,
        speed:     0.4,
        direction: 'none',
        random:    true,
        outModes:  { default: 'out' },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: !isMobile, mode: 'repulse' },
        onClick: { enable: false },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    detectRetina: true,
  });

  // Footer particles (mini version)
  const footerEl = document.getElementById('footerParticles');
  if (footerEl) {
    await tsParticles.load('footerParticles', {
      fullScreen:  { enable: false },
      background:  { color: { value: 'transparent' } },
      fpsLimit:    30,
      particles: {
        number: { value: 20, density: { enable: true, area: 800 } },
        color:  { value: ['#00d4ff', '#7c3aed'] },
        shape:  { type: 'circle' },
        opacity:{ value: { min: 0.02, max: 0.15 } },
        size:   { value: { min: 1, max: 3 } },
        move:   { enable: true, speed: 0.3, outModes: { default: 'out' } },
        links:  { enable: false },
      },
      interactivity: { events: { onHover: { enable: false } } },
      detectRetina: true,
    });
  }
}

/* ================================================================
   CONTACT FORM
   ================================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn-text');
    const orig = text.textContent;
    text.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    new FormData(form),
      });
      if (res.ok) {
        form.reset();
        if (success) success.classList.add('visible');
        text.textContent = '✓ Sent!';
        setTimeout(() => {
          text.textContent = orig;
          btn.disabled = false;
          if (success) success.classList.remove('visible');
        }, 5000);
      } else {
        throw new Error('Network error');
      }
    } catch {
      text.textContent = 'Error — try email directly';
      btn.disabled = false;
    }
  });
}

/* ================================================================
   THREE.JS — HERO NEURAL NETWORK
   ================================================================ */
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  // ── Renderer ──────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ── Scene & Camera ────────────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  // ── Lights ────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const ptCyan   = new THREE.PointLight(0x00d4ff, 1.5, 20);
  const ptViolet = new THREE.PointLight(0x7c3aed, 1.5, 20);
  ptCyan.position.set(-4, 2, 2);
  ptViolet.position.set(4, -2, 2);
  scene.add(ptCyan, ptViolet);

  // ── Neural Network Nodes (layered) ────────────────────────────
  const LAYERS   = [3, 5, 7, 7, 5, 3];
  const LAYER_GAP = 2.0;
  const NODE_GAP  = 1.1;
  const START_X   = -(LAYERS.length - 1) * LAYER_GAP / 2;

  const nodeGroups = []; // array of arrays

  LAYERS.forEach((count, li) => {
    const group = [];
    const xPos  = START_X + li * LAYER_GAP;
    const startY = -(count - 1) * NODE_GAP / 2;

    for (let ni = 0; ni < count; ni++) {
      const isCyan = li === 0 || li === LAYERS.length - 1;
      const color  = isCyan ? 0x00d4ff : (li % 2 === 0 ? 0x7c3aed : 0x00d4ff);

      // Core sphere
      const geo  = new THREE.SphereGeometry(0.1, 20, 20);
      const mat  = new THREE.MeshPhongMaterial({
        color,
        emissive:          color,
        emissiveIntensity: 0.6,
        shininess:         80,
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.set(
        xPos + (Math.random() - 0.5) * 0.25,
        startY + ni * NODE_GAP + (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 1.5
      );

      // Glow sprite
      const glowGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent:  true,
        opacity:      0.12,
        blending:     THREE.AdditiveBlending,
        depthWrite:   false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      node.add(glow);

      scene.add(node);
      group.push({ mesh: node, baseY: node.position.y, phase: Math.random() * Math.PI * 2 });
    }
    nodeGroups.push(group);
  });

  // ── Edges between adjacent layers ─────────────────────────────
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent:  true,
    opacity:      0.18,
    blending:     THREE.AdditiveBlending,
    depthWrite:   false,
  });

  const edgeGroup = new THREE.Group();
  scene.add(edgeGroup);

  for (let li = 0; li < nodeGroups.length - 1; li++) {
    const layerA = nodeGroups[li];
    const layerB = nodeGroups[li + 1];

    layerA.forEach(a => {
      layerB.forEach(b => {
        if (Math.random() < 0.5) return; // sparse connections

        const points  = [a.mesh.position, b.mesh.position];
        const colors  = [new THREE.Color(0x00d4ff), new THREE.Color(0x7c3aed)];
        const geo     = new THREE.BufferGeometry().setFromPoints(points);
        const colArr  = new Float32Array([...colors[0].toArray(), ...colors[1].toArray()]);
        geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));

        edgeGroup.add(new THREE.Line(geo, lineMat));
      });
    });
  }

  // ── Background low-poly floating shapes ───────────────────────
  const floaters = [];
  const shapes   = [THREE.IcosahedronGeometry, THREE.OctahedronGeometry, THREE.TetrahedronGeometry];

  for (let i = 0; i < 12; i++) {
    const ShapeClass = shapes[i % shapes.length];
    const size  = 0.3 + Math.random() * 0.6;
    const geo   = new ShapeClass(size, 0);
    const col   = Math.random() > 0.5 ? 0x00d4ff : 0x7c3aed;
    const mat   = new THREE.MeshBasicMaterial({
      color:       col,
      wireframe:   true,
      transparent: true,
      opacity:     0.08 + Math.random() * 0.1,
    });
    const mesh  = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 14,
      -3 - Math.random() * 8
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(mesh);
    floaters.push({
      mesh,
      rotX: (Math.random() - 0.5) * 0.004,
      rotY: (Math.random() - 0.5) * 0.004,
      floatAmp:  0.3 + Math.random() * 0.4,
      floatPhase: Math.random() * Math.PI * 2,
    });
  }

  // ── Signal pulses along edges ──────────────────────────────────
  const pulseGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false });
  const pulses   = [];
  let   pulsTimer = 0;

  function spawnPulse() {
    const li = Math.floor(Math.random() * (nodeGroups.length - 1));
    const a  = nodeGroups[li][Math.floor(Math.random() * nodeGroups[li].length)];
    const b  = nodeGroups[li + 1][Math.floor(Math.random() * nodeGroups[li + 1].length)];
    const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
    scene.add(mesh);
    pulses.push({ mesh, a: a.mesh.position, b: b.mesh.position, t: 0, speed: 0.012 + Math.random() * 0.015 });
  }

  // ── Resize ────────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // ── Mouse tilt ────────────────────────────────────────────────
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 1.0;
    targetY = (e.clientY / window.innerHeight - 0.5) * -0.6;
  }, { passive: true });

  // ── Animate ───────────────────────────────────────────────────
  let t = 0;
  let camAngle = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.016;

    // Camera orbit + mouse tilt
    camAngle += 0.003;
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    camera.position.x  = Math.sin(camAngle) * 1.5 + currentX * 2;
    camera.position.y  = Math.sin(camAngle * 0.6) * 0.8 + currentY * 1.5;
    camera.lookAt(scene.position);

    // Node pulse animation
    nodeGroups.forEach(layer => {
      layer.forEach(({ mesh, phase }) => {
        const s = 1 + 0.25 * Math.sin(t * 2.5 + phase);
        mesh.scale.setScalar(s);
        mesh.material.emissiveIntensity = 0.4 + 0.4 * Math.abs(Math.sin(t * 2 + phase));
      });
    });

    // Floating background shapes
    floaters.forEach(({ mesh, rotX, rotY, floatAmp, floatPhase }) => {
      mesh.rotation.x += rotX;
      mesh.rotation.y += rotY;
      mesh.position.y += Math.sin(t + floatPhase) * 0.0008 * floatAmp;
    });

    // Signal pulses
    pulsTimer += 0.016;
    if (pulsTimer > 0.35) {
      pulsTimer = 0;
      if (pulses.length < 12) spawnPulse();
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        pulses.splice(i, 1);
      } else {
        p.mesh.position.lerpVectors(p.a, p.b, p.t);
        p.mesh.material.opacity = Math.sin(p.t * Math.PI);
      }
    }

    renderer.render(scene, camera);
  };

  animate();
}

/* ================================================================
   THREE.JS — TECH STACK GLOBE
   ================================================================ */
function initGlobeScene() {
  const wrap   = document.getElementById('globeWrap');
  const canvas = document.getElementById('globeCanvas');
  const labels = document.getElementById('globeLabels');
  if (!wrap || !canvas || !labels) return;

  // ── Renderer ──────────────────────────────────────────────────
  const W = wrap.clientWidth;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, W);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 4;

  // ── Globe wireframe ───────────────────────────────────────────
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const sphGeo  = new THREE.IcosahedronGeometry(1.6, 5);
  const sphMat  = new THREE.MeshBasicMaterial({
    color:       0x00d4ff,
    wireframe:   true,
    transparent: true,
    opacity:     0.12,
  });
  globeGroup.add(new THREE.Mesh(sphGeo, sphMat));

  // Inner glow sphere
  const innerGeo = new THREE.SphereGeometry(1.55, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color:       0x7c3aed,
    transparent: true,
    opacity:     0.04,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });
  globeGroup.add(new THREE.Mesh(innerGeo, innerMat));

  // ── Keyword labels ────────────────────────────────────────────
  const KEYWORDS = [
    'PyTorch', 'LangChain', 'RAG', 'Transformers', 'LLM',
    'NLP', 'Computer Vision', 'MLOps', 'Embeddings', 'Fine-tuning',
    'Hugging Face', 'Vector DB', 'CUDA', 'Agentic AI', 'LoRA / QLoRA',
    'FAISS', 'Pinecone', 'Diffusion', 'FinBERT', 'vLLM',
  ];

  // Fibonacci sphere distribution
  const kwData = KEYWORDS.map((kw, i) => {
    const phi   = Math.acos(1 - 2 * (i + 0.5) / KEYWORDS.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r     = 1.85;
    const pos   = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    const div = document.createElement('span');
    div.className   = 'globe-kw';
    div.textContent = kw;
    labels.appendChild(div);
    return { kw, pos, div };
  });

  // ── Orbit rings ───────────────────────────────────────────────
  const ringMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.08 });
  [1.7, 1.9, 2.1].forEach(r => {
    const pts   = [];
    const segs  = 64;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const rGeo = new THREE.BufferGeometry().setFromPoints(pts);
    globeGroup.add(new THREE.Line(rGeo, ringMat.clone()));
  });

  // ── Animate ───────────────────────────────────────────────────
  let rotY = 0;
  let rotX = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    rotY += 0.006;
    rotX = Math.sin(rotY * 0.4) * 0.25;

    globeGroup.rotation.y = rotY;
    globeGroup.rotation.x = rotX;

    // Project labels
    kwData.forEach(({ pos, div }) => {
      const worldPos = pos.clone().applyEuler(new THREE.Euler(rotX, rotY, 0));
      const proj     = worldPos.clone().project(camera);

      div.style.left    = `${((proj.x + 1) / 2 * W).toFixed(1)}px`;
      div.style.top     = `${((-proj.y + 1) / 2 * W).toFixed(1)}px`;
      // Depth: positive z is facing camera
      const depth = (worldPos.z + 2) / 4; // 0..1
      div.style.opacity  = (0.15 + depth * 0.85).toFixed(3);
      div.style.fontSize = `${(0.58 + depth * 0.22).toFixed(3)}rem`;
    });

    renderer.render(scene, camera);
  };

  animate();

  // ── Resize ────────────────────────────────────────────────────
  const onResize = () => {
    const w = wrap.clientWidth;
    renderer.setSize(w, w);
  };
  window.addEventListener('resize', onResize);

  // ScrollTrigger — start heavy animation only in view
  ScrollTrigger.create({
    trigger: wrap,
    start:   'top 80%',
    once:    true,
    onEnter: () => {
      gsap.fromTo(canvas, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
    },
  });
}

/* ================================================================
   FALLBACK — static orbs for low-power devices
   ================================================================ */
function initStaticFallback() {
  // Hide heavy canvases
  ['heroCanvas', 'globeCanvas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Simple CSS gradient orbs
  const hero = document.getElementById('hero');
  if (hero) {
    const orb = document.createElement('div');
    orb.style.cssText = `
      position:absolute;inset:0;z-index:0;overflow:hidden;
      background:radial-gradient(ellipse 80% 60% at 50% 50%,
        rgba(0,212,255,0.07) 0%, rgba(124,58,237,0.05) 50%, transparent 100%);
    `;
    hero.prepend(orb);
  }
}

/* ================================================================
   INIT
   ES Modules are deferred — DOM is ready by the time this runs.
   We still guard with readyState for edge cases.
   ================================================================ */
function boot() {
  initLoader();
  initScrollProgress();
  initTheme();
  initLenis();
  initCursor();
  initNavbar();
  initTyped();
  initFlipCards();
  initTilt();
  initContactForm();

  // GSAP must register before use
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
    initCounters();
  }

  // Particles
  initParticles();

  // Three.js — only on capable devices
  if (ENABLE_3D) {
    initHeroScene();
    initGlobeScene();
  } else {
    initStaticFallback();
  }
}

// Module scripts run after HTML is parsed (deferred). Boot immediately.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
