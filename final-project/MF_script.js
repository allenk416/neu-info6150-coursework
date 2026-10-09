const searchForm = document.getElementById('movie-search-form');
const searchInput = document.getElementById('movie-search');
const movieDisplay = document.getElementById('movie-display');
const themeToggle = document.querySelector('.toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.querySelectorAll('body, .navbar-container, .search-container, #movie-display, .toggle, footer')
      .forEach((element) => element.classList.toggle('active'));
    themeToggle.querySelector('.toggle-ball')?.classList.toggle('active');
    themeToggle.setAttribute('aria-pressed', String(themeToggle.classList.contains('active')));
  });
}

function showSearchMessage(message) {
  const status = document.createElement('p');
  status.className = 'search-status';
  status.setAttribute('role', 'status');
  status.textContent = message;
  movieDisplay.replaceChildren(status);
}

function safePosterUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function renderMovieResults(data) {
  const results = data?.titleResults?.results;
  if (!Array.isArray(results) || results.length === 0) {
    showSearchMessage('No matching movies were found.');
    return;
  }

  const fragment = document.createDocumentFragment();
  results.slice(0, 10).forEach((movie) => {
    const title = movie?.titleNameText;
    if (typeof title !== 'string' || !title.trim()) return;

    const card = document.createElement('article');
    card.className = 'movie-card';
    const heading = document.createElement('h2');
    heading.textContent = title;
    card.append(heading);

    const poster = safePosterUrl(movie?.titlePosterImageModel?.url);
    if (poster) {
      const image = document.createElement('img');
      image.className = 'movie-poster';
      image.src = poster;
      image.alt = `${title} poster`;
      image.loading = 'lazy';
      card.append(image);
    }

    const overview = movie?.titlePosterImageModel?.caption;
    const description = document.createElement('p');
    description.textContent = typeof overview === 'string' && overview.trim()
      ? overview
      : 'No overview is available.';
    card.append(description);
    fragment.append(card);
  });

  if (!fragment.childNodes.length) {
    showSearchMessage('No matching movies were found.');
    return;
  }
  movieDisplay.replaceChildren(fragment);
}

async function searchMovie(query) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    showSearchMessage('Enter a movie title to search.');
    return;
  }

  showSearchMessage('Searching…');
  try {
    const endpoint = new URL('./api/movies/search', window.location.href);
    endpoint.searchParams.set('query', normalizedQuery);
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Search service unavailable');
    renderMovieResults(await response.json());
  } catch {
    showSearchMessage('Movie search is unavailable until a server-side API service is configured. No API key is stored in this page.');
  }
}

if (searchForm && searchInput && movieDisplay) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('searchTerm', query);
    else url.searchParams.delete('searchTerm');
    window.history.replaceState({}, '', url);
    void searchMovie(query);
  });

  const initialQuery = new URLSearchParams(window.location.search).get('searchTerm') || '';
  searchInput.value = initialQuery;
  if (initialQuery) void searchMovie(initialQuery);
}
