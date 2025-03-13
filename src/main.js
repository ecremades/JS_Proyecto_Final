// Importar estilos
import './unified-styles.css';

// API Key para The Guardian
const API_KEY = 'test'; // Usa 'test' para desarrollo o tu propia API key para producción
const API_URL = 'https://content.guardianapis.com';

// Registrar información de entorno
console.log('Entorno de ejecución:', window.location.href);
console.log('Base URL:', document.baseURI);

// Detectar si estamos en GitHub Pages
window.addEventListener('DOMContentLoaded', function() {
  const isGitHubPages = window.location.href.includes('github.io');
  console.log('Ejecutando en GitHub Pages:', isGitHubPages);
  
  // Añadir una clase al body para aplicar estilos específicos si es necesario
  if (isGitHubPages) {
    document.body.classList.add('github-pages');
  }
});

// Estado de la aplicación
let currentPage = 1;
let currentCategory = '';
let currentSearch = '';
let isLoading = false;
let hasMorePages = true;

// Elementos del DOM
let newsContainer, searchInput, searchButton, loadMoreButton, categoryLinks, loadingIndicator, errorContainer;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, inicializando aplicación...');
  
  // Inicializar referencias a elementos DOM
  initDOMReferences();
  
  // Verificar que todos los elementos DOM estén disponibles
  if (!newsContainer || !searchInput || !searchButton || !loadMoreButton || !loadingIndicator || !errorContainer) {
    console.error('No se pudieron encontrar todos los elementos DOM necesarios');
    showErrorOnPage('Error: No se pudieron encontrar todos los elementos necesarios en la página.');
    return;
  }

  console.log('DOM cargado completamente, iniciando aplicación...');
  
  // Cargar noticias iniciales
  fetchNews();

  // Event listeners
  setupEventListeners();
});

/**
 * Inicializa referencias a elementos DOM
 */
function initDOMReferences() {
  console.log('Inicializando referencias DOM...');
  newsContainer = document.getElementById('news-container');
  searchInput = document.getElementById('search-input');
  searchButton = document.getElementById('search-button');
  loadMoreButton = document.getElementById('load-more');
  categoryLinks = document.querySelectorAll('.category-link');
  loadingIndicator = document.getElementById('loading-indicator');
  errorContainer = document.getElementById('error-container');
  
  // Registrar si se encontraron los elementos
  console.log('news-container encontrado:', !!newsContainer);
  console.log('search-input encontrado:', !!searchInput);
  console.log('search-button encontrado:', !!searchButton);
  console.log('load-more encontrado:', !!loadMoreButton);
  console.log('category-links encontrados:', categoryLinks?.length);
  console.log('loading-indicator encontrado:', !!loadingIndicator);
  console.log('error-container encontrado:', !!errorContainer);
}

/**
 * Muestra un error directamente en la página cuando no se puede usar el contenedor de errores normal
 */
function showErrorOnPage(message) {
  console.error(message);
  // Crear un elemento de error y añadirlo al body si no podemos usar el contenedor normal
  const errorDiv = document.createElement('div');
  errorDiv.style.backgroundColor = '#f8d7da';
  errorDiv.style.color = '#721c24';
  errorDiv.style.padding = '1rem';
  errorDiv.style.margin = '1rem';
  errorDiv.style.borderRadius = '0.25rem';
  errorDiv.style.border = '1px solid #f5c6cb';
  errorDiv.textContent = message;
  
  // Insertar al principio del body o en un contenedor visible
  const container = document.querySelector('main') || document.body;
  container.insertBefore(errorDiv, container.firstChild);
}

/**
 * Configura los event listeners para los elementos interactivos
 */
function setupEventListeners() {
  console.log('Configurando event listeners...');
  
  try {
    // Búsqueda
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Categorías
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.closest('a').dataset.category;
        handleCategoryChange(category);
      });
    });

    // Cargar más noticias
    loadMoreButton.addEventListener('click', () => {
      currentPage++;
      fetchNews(false);
    });

    console.log('Event listeners configurados correctamente');
  } catch (error) {
    console.error('Error al configurar event listeners:', error);
    showErrorOnPage(`Error al configurar la interactividad: ${error.message}`);
  }
}

/**
 * Maneja el cambio de categoría
 * @param {string} category - La categoría seleccionada
 */
function handleCategoryChange(category) {
  console.log(`Cambiando a categoría: ${category}`);
  
  // Actualizar UI para mostrar la categoría activa
  categoryLinks.forEach(link => {
    if (link.dataset.category === category) {
      link.classList.add('active-category');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active-category');
      link.removeAttribute('aria-current');
    }
  });

  // Resetear estado y cargar noticias de la categoría
  currentCategory = category;
  currentSearch = '';
  currentPage = 1;
  searchInput.value = '';
  newsContainer.innerHTML = '';
  fetchNews();
}

/**
 * Maneja la búsqueda de noticias
 */
function handleSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    console.log(`Buscando: ${searchTerm}`);
    currentSearch = searchTerm;
    currentCategory = '';
    currentPage = 1;
    newsContainer.innerHTML = '';
    
    // Resetear categorías activas
    categoryLinks.forEach(link => {
      link.classList.remove('active-category');
      link.removeAttribute('aria-current');
    });
    
    fetchNews();
  }
}

/**
 * Obtiene noticias de la API de The Guardian
 * @param {boolean} resetContainer - Si se debe resetear el contenedor de noticias
 */
async function fetchNews(resetContainer = true) {
  if (isLoading) return;
  
  isLoading = true;
  errorContainer.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');
  loadMoreButton.classList.add('hidden');
  
  try {
    console.log(`Obteniendo noticias - Página: ${currentPage}, Categoría: ${currentCategory || 'todas'}, Búsqueda: ${currentSearch || 'ninguna'}`);
    
    // Construir la URL de la API
    let url = `${API_URL}/search?api-key=${API_KEY}&show-fields=headline,trailText,thumbnail,shortUrl&page=${currentPage}&page-size=10`;
    
    if (currentSearch) {
      url += `&q=${encodeURIComponent(currentSearch)}`;
    }
    
    if (currentCategory) {
      url += `&section=${currentCategory}`;
    }
    
    console.log(`URL de la API: ${url}`);
    
    const response = await fetch(url);
    console.log('Estado de la respuesta:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos de la API:', data ? 'Sí' : 'No');
    
    if (!data || !data.response || !data.response.results) {
      console.error('Estructura de datos inesperada:', data);
      throw new Error('Formato de respuesta de API inesperado');
    }
    
    const articles = data.response.results;
    console.log(`Artículos recibidos: ${articles.length}`);
    
    // Verificar si hay más páginas
    hasMorePages = currentPage < data.response.pages;
    
    if (resetContainer) {
      newsContainer.innerHTML = '';
    }
    
    // Renderizar artículos
    renderArticles(articles);
    
    // Mostrar/ocultar botón de cargar más
    if (hasMorePages) {
      loadMoreButton.classList.remove('hidden');
    } else {
      loadMoreButton.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    showError(`No pudimos cargar las noticias: ${error.message}. Por favor, intenta de nuevo más tarde.`);
  } finally {
    isLoading = false;
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * Renderiza los artículos en el contenedor de noticias
 * @param {Array} articles - Array de artículos a renderizar
 */
function renderArticles(articles) {
  console.log('Renderizando artículos...');
  
  if (articles.length === 0) {
    newsContainer.innerHTML = `
      <div class="p-4 text-center">
        <p class="text-gray-600">No se encontraron noticias que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }
  
  articles.forEach((article, index) => {
    console.log(`Renderizando artículo ${index + 1}/${articles.length}`);
    const fields = article.fields || {};
    const articleElement = document.createElement('article');
    articleElement.className = 'news-article bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
    articleElement.setAttribute('role', 'article');
    
    // Usar una imagen de placeholder si no hay thumbnail disponible
    const thumbnailUrl = fields.thumbnail || 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
    
    articleElement.innerHTML = `
      <div class="md:flex">
        <div class="md:w-1/3 relative">
          ${fields.thumbnail 
            ? `<img src="${fields.thumbnail}" alt="${fields.headline || 'Noticia'}" class="h-48 w-full object-cover" loading="lazy">` 
            : `<div class="h-48 w-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400">No image available</span></div>`
          }
        </div>
        <div class="p-4 md:w-2/3">
          <h2 class="text-xl font-bold mb-2">
            <a href="${fields.shortUrl || '#'}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 focus:outline-none focus:underline" aria-label="${fields.headline || 'Noticia'}">
              ${fields.headline || 'Título no disponible'}
            </a>
          </h2>
          <p class="text-gray-700 mb-4">${fields.trailText || 'No description available'}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">${formatDate(article.webPublicationDate)}</span>
            <a href="${fields.shortUrl || '#'}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Read more about ${fields.headline || 'esta noticia'}">
              Leer más
            </a>
          </div>
        </div>
      </div>
    `;
    
    newsContainer.appendChild(articleElement);
  });
  
  console.log('Artículos renderizados correctamente');
}

/**
 * Muestra un mensaje de error
 * @param {string} message - El mensaje de error a mostrar
 */
function showError(message) {
  console.error(`Error: ${message}`);
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
  } else {
    showErrorOnPage(message);
  }
}

/**
 * Formatea la fecha en un formato legible
 * @param {string} dateString - La fecha en formato ISO
 * @returns {string} La fecha formateada
 */
function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
}
