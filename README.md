# Noticias App

Aplicación web para visualizar noticias en tiempo real utilizando la API de The Guardian.

## Características

- Interfaz de usuario moderna y responsiva construida con Tailwind CSS
- Navegación por categorías de noticias
- Búsqueda de noticias por términos específicos
- Paginación con botón "Cargar más noticias"
- Indicadores de carga y manejo de errores
- Diseño accesible con atributos ARIA y estructura semántica

## Requisitos cumplidos

- Uso de API externa (The Guardian)
- Implementación de búsqueda y filtrado
- Diseño responsivo para diferentes dispositivos
- Interfaz de usuario intuitiva y atractiva
- Manejo de errores y estados de carga
- Implementación de accesibilidad

## Tecnologías utilizadas

- HTML5
- CSS3 con Tailwind CSS
- JavaScript (ES6+)
- Vite como bundler
- Fetch API para peticiones HTTP
- GitHub Actions para despliegue automático

## Estructura del proyecto

```
news-app/
├── .github/
│   └── workflows/
│       └── deploy.yml    # Configuración de GitHub Actions
├── public/
│   └── favicon.svg      # Favicon de la aplicación
├── src/
│   ├── main.js          # Lógica principal de la aplicación
│   └── style.css        # Estilos CSS y configuración de Tailwind
├── index.html           # Estructura HTML principal
├── package.json         # Dependencias y scripts
├── postcss.config.js    # Configuración de PostCSS
├── tailwind.config.js   # Configuración de Tailwind CSS
└── vite.config.js       # Configuración de Vite
```

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/ecremades/JS_Proyecto_Final.git
cd JS_Proyecto_Final
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Despliegue

La aplicación está desplegada en GitHub Pages y puede accederse a través del siguiente enlace:

[Ver Noticias App en GitHub Pages](https://ecremades.github.io/JS_Proyecto_Final/)

## Compilación para producción

Para compilar la aplicación para producción:

```bash
npm run build
```

Esto generará una versión optimizada en la carpeta `dist/`.

Para preparar los archivos para GitHub Pages:

```bash
node copy-for-github-pages.cjs
```

## API

Esta aplicación utiliza la API de The Guardian para obtener noticias. Para desarrollo, se utiliza la clave de API 'test'. Para producción, deberías obtener tu propia clave de API en [The Guardian API Portal](https://open-platform.theguardian.com/).

## Autor

- **Enrique Cremades** - [ecremades](https://github.com/ecremades)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
