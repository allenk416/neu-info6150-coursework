const slides = [...document.querySelectorAll('.slider .list .item')];
const thumbnails = [...document.querySelectorAll('.thumbnail .item')];
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('prev');

if (slides.length && thumbnails.length === slides.length && nextButton && previousButton) {
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const isActive = i === activeIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      thumbnails[i].classList.toggle('active', isActive);
      thumbnails[i].setAttribute('aria-pressed', String(isActive));
    });
  }

  nextButton.addEventListener('click', () => showSlide(activeIndex + 1));
  previousButton.addEventListener('click', () => showSlide(activeIndex - 1));

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.setAttribute('role', 'button');
    thumbnail.setAttribute('tabindex', '0');
    thumbnail.setAttribute('aria-label', `Show movie ${index + 1}`);
    thumbnail.addEventListener('click', () => showSlide(index));
    thumbnail.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showSlide(index);
      }
    });
  });

  showSlide(activeIndex);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let autoplay = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    document.querySelector('.slider')?.addEventListener('mouseenter', () => window.clearInterval(autoplay), { once: true });
    document.querySelector('.slider')?.addEventListener('focusin', () => window.clearInterval(autoplay), { once: true });
  }
}
