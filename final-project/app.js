const searchForm = document.getElementById('movie-search-form');
const searchInput = document.getElementById('movie-search');

document.querySelectorAll('.arrow').forEach((arrow) => {
  const wrapper = arrow.closest('.movie-list-wrapper');
  const movieList = wrapper?.querySelector('.movie-list');
  if (!wrapper || !movieList) return;

  let offset = 0;
  const moveNext = () => {
    const maxOffset = Math.max(0, movieList.scrollWidth - wrapper.clientWidth);
    const step = Math.max(220, wrapper.clientWidth - 100);
    offset = offset >= maxOffset - 1 ? 0 : Math.min(maxOffset, offset + step);
    movieList.style.transform = `translateX(-${offset}px)`;
  };

  arrow.addEventListener('click', moveNext);
  window.addEventListener('resize', () => {
    const maxOffset = Math.max(0, movieList.scrollWidth - wrapper.clientWidth);
    offset = Math.min(offset, maxOffset);
    movieList.style.transform = `translateX(-${offset}px)`;
  });
});

const themeToggle = document.querySelector('.toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.querySelectorAll('.container, .movie-list-title, .navbar-container, .toggle, footer')
      .forEach((element) => element.classList.toggle('active'));
    themeToggle.querySelector('.toggle-ball')?.classList.toggle('active');
    themeToggle.setAttribute('aria-pressed', String(themeToggle.classList.contains('active')));
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      searchInput.focus();
      return;
    }
    window.location.assign(`MF.html?searchTerm=${encodeURIComponent(query)}`);
  });
}
