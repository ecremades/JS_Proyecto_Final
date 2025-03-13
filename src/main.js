import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '3c2d0c3a-a892-4a96-a2c7-5e3c8177c3a2';
  const apiUrl = 'https://content.guardianapis.com/search';
  const newsContainer = document.getElementById('news-container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const loadMoreButton = document.getElementById('load-more');
  
  let currentPage = 1;
  let currentQuery = '';
  
  // Función para obtener noticias
  async function fetchNews(query = '', page = 1) {
    try {
      const params = new URLSearchParams({
        'api-key': apiKey,
        'page': page,
        'page-size': 10,
        'show-fields': 'headline,trailText,thumbnail',
        'q': query
      });
      
      const response = await fetch(`${apiUrl}?${params}`);
      const data = await response.json();
      
      return data.response;
    } catch (error) {
      console.error('Error fetching news:', error);
      return null;
    }
  }
  
  // Función para renderizar las noticias
  function renderNews(articles, clear = false) {
    if (clear) {
      newsContainer.innerHTML = '';
    }
    
    if (articles.length === 0) {
      newsContainer.innerHTML = '<p class="text-center text-gray-500">No se encontraron noticias.</p>';
      return;
    }
    
    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
      
      const thumbnail = article.fields && article.fields.thumbnail 
        ? `<img src="${article.fields.thumbnail}" alt="${article.webTitle}" class="w-full h-48 object-cover">`
        : '<div class="w-full h-48 bg-gray-200 flex items-center justify-center"><span class="text-gray-400">No image available</span></div>';
      
      card.innerHTML = `
        ${thumbnail}
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">${article.webTitle}</h2>
          <p class="text-gray-700 mb-4">${article.fields && article.fields.trailText ? article.fields.trailText : ''}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">${new Date(article.webPublicationDate).toLocaleDateString()}</span>
            <a href="${article.webUrl}" target="_blank" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Read More</a>
          </div>
        </div>
      `;
      
      newsContainer.appendChild(card);
    });
  }
  
  // Cargar noticias iniciales
  async function loadInitialNews() {
    const data = await fetchNews();
    if (data) {
      renderNews(data.results, true);
      loadMoreButton.style.display = data.pages > 1 ? 'block' : 'none';
    }
  }
  
  // Buscar noticias
  async function searchNews() {
    const query = searchInput.value.trim();
    currentQuery = query;
    currentPage = 1;
    
    const data = await fetchNews(query);
    if (data) {
      renderNews(data.results, true);
      loadMoreButton.style.display = data.pages > currentPage ? 'block' : 'none';
    }
  }
  
  // Cargar más noticias
  async function loadMoreNews() {
    currentPage++;
    const data = await fetchNews(currentQuery, currentPage);
    if (data) {
      renderNews(data.results, false);
      loadMoreButton.style.display = data.pages > currentPage ? 'block' : 'none';
    }
  }
  
  // Event listeners
  searchButton.addEventListener('click', searchNews);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchNews();
    }
  });
  loadMoreButton.addEventListener('click', loadMoreNews);
  
  // Cargar noticias al iniciar
  loadInitialNews();
});
