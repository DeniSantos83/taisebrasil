// ========== util ==========
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ========== on ready ==========
document.addEventListener('DOMContentLoaded', () => {
  // Ano no rodapé
  const yearSpan = $('#year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Navbar: muda visual ao rolar
  const navbar = $('.navbar');
  const hero = $('.hero');
  const heroH = hero ? hero.offsetHeight : 0;

  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > heroH * 0.3) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Navbar: marca quando o menu mobile abre/fecha (útil para CSS)
  const collapse = $('#navmenu');
  if (collapse && navbar) {
    collapse.addEventListener('show.bs.collapse', () => navbar.classList.add('nav-open'));
    collapse.addEventListener('hide.bs.collapse', () => navbar.classList.remove('nav-open'));
  }

  // Scroll suave para âncoras
  $$('a.nav-link[href^="#"], .navbar-brand[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        const target = $(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // fecha o menu no mobile após o clique
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse, { toggle: false });
          bsCollapse.hide();
        }
      }
    });
  });

  // ========== Formulário -> WhatsApp ==========
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const phone = '5579991160780'; // DDI+DDD+numero (sem +)
      const name = $('#name')?.value.trim() || '';
      const email = $('#email')?.value.trim() || '';
      const msg = $('#message')?.value.trim() || '';

      if (!name || !email || !msg) {
        alert('Por favor, preencha nome, e-mail e mensagem.');
        return;
      }

      const text = `
Olá, Taise! 👋

*Novo contato pelo site*:

*Nome:* ${name}
*E-mail:* ${email}
*Mensagem:*
${msg}

— Percursos Analíticos
      `.trim();

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      // Abre o WhatsApp (app ou web). Use location.href para mesma aba, se preferir.
      window.open(url, '_blank');
      form.reset();
    });
  }

  // ========== Lightbox (galeria) ==========
  const links = $$('.glink');
  const lightbox = $('#lightbox');
  const img = $('.lightbox-img', lightbox);
  const btnClose = $('.lightbox-close', lightbox);
  const btnPrev = $('.lightbox-prev', lightbox);
  const btnNext = $('.lightbox-next', lightbox);
  let current = -1;

  const open = (index) => {
    if (!lightbox || !img) return;
    current = index;
    img.src = links[current].getAttribute('href');
    img.alt = links[current].querySelector('img')?.alt || 'Imagem';
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    if (!lightbox || !img) return;
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    img.src = '';
  };

  const prev = () => open((current - 1 + links.length) % links.length);
  const next = () => open((current + 1) % links.length);

  links.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose?.addEventListener('click', close);
  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
});

// ===== filtro da galeria =====
(() => {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const items = Array.from(document.querySelectorAll('.gitem'));
  if (!buttons.length || !items.length) return;

  const apply = (cat) => {
    items.forEach(el => {
      const ok = cat === 'all' || el.dataset.cat === cat;
      el.style.display = ok ? '' : 'none';
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      apply(btn.dataset.filter);
    });
  });

  apply('all');
})();

// Texto padrão (você pode trocar)
const RESUMO_ANALISE = `
  <p>Na psicanálise, não há silêncio absoluto: o sintoma fala quando a voz falha.</p>
  <p>Na análise, o indizível ganha contorno e a repetição vira narrativa — é a elaboração.</p>
  <p>Escrever ajuda: pausar, revisar sentidos e reinscrever-se na própria história, menos pelo sintoma e mais pelo sentido.</p>
`;

document.addEventListener('DOMContentLoaded', () => {
  const items  = document.querySelectorAll('[data-gallery-item]');
  const imgEl  = document.getElementById('lbImg');
  const textEl = document.getElementById('lbText');
  const modalEl= document.getElementById('lightboxModal');

  if (!items.length || !imgEl || !textEl || !modalEl) return;

  let bsModal = new bootstrap.Modal(modalEl, { focus: true });

  items.forEach(btn => {
    btn.addEventListener('click', () => {
      const bigSrc = btn.getAttribute('data-img');
      const custom = btn.getAttribute('data-text');

      imgEl.src = bigSrc || btn.querySelector('img')?.src || '';
      imgEl.alt = btn.querySelector('img')?.alt || 'Foto ampliada';
      textEl.innerHTML = custom || RESUMO_ANALISE;

      bsModal.show();
    });
  });

  modalEl.addEventListener('hidden.bs.modal', () => { imgEl.src = ''; });
});