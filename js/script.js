// Atualiza ano no rodapé
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Navbar muda ao rolar
  const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');
  const heroHeight = hero ? hero.offsetHeight : 0;

  const onScroll = () => {
    if (window.scrollY > heroHeight * 0.3) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Scroll suave para âncoras
  document.querySelectorAll('a.nav-link[href^="#"], .navbar-brand[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.startsWith('#')) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Tratamento simples do formulário (mock)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value?.trim() || '';
      alert(`Obrigado, ${name || 'tudo bem?'}! Sua mensagem foi recebida. Responderei em breve.`);
      form.reset();
    });
  }

  // ---------- LIGHTBOX ----------
  const links = Array.from(document.querySelectorAll('.glink'));
  const lightbox = document.getElementById('lightbox');
  const img = lightbox?.querySelector('.lightbox-img');
  const btnClose = lightbox?.querySelector('.lightbox-close');
  const btnPrev = lightbox?.querySelector('.lightbox-prev');
  const btnNext = lightbox?.querySelector('.lightbox-next');
  let current = -1;

  const open = (index) => {
    if (!lightbox) return;
    current = index;
    img.src = links[current].getAttribute('href');
    img.alt = links[current].querySelector('img')?.alt || 'Imagem';
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
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

// ---------- FORM TO WHATSAPP ----------
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = '5579991160780'; // WhatsApp da Taise (DDI+DDD+numero, sem +)

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const msg = document.getElementById('message')?.value.trim() || '';

    // Validação simples
    if (!name || !email || !msg) {
      alert('Por favor, preencha nome, e-mail e mensagem.');
      return;
    }

    // Monte o texto que vai no WhatsApp
    const text = `
Olá, Taise! 👋

*Novo contato pelo site*:

*Nome:* ${name}
*E-mail:* ${email}
*Mensagem:*
${msg}

— Percursos Analíticos
`.trim();

    // Cria o link para abrir WhatsApp (app ou web)
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    // Abre em nova aba/janela (ou use location.href = url para redirecionar na mesma)
    window.open(url, '_blank');

    // Opcional: limpar o formulário
    form.reset();
  });
}