const fs = require('fs');
const path = require('path');

// Rutas de los archivos
const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(distDir, 'index.html');
const backupHtml = path.join(distDir, 'index.original.html');

// Verificar que el directorio dist existe
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: El directorio dist no existe. Ejecuta npm run build primero.');
  process.exit(1);
}

// Hacer una copia de seguridad del archivo index.html original
if (fs.existsSync(indexHtml)) {
  try {
    fs.copyFileSync(indexHtml, backupHtml);
    console.log('✅ Copia de seguridad creada:', backupHtml);
  } catch (error) {
    console.error('❌ Error al crear copia de seguridad:', error);
    process.exit(1);
  }
}

// Leer el archivo index.html
try {
  let content = fs.readFileSync(indexHtml, 'utf8');
  
  // Modificar las rutas para que funcionen en GitHub Pages
  content = content.replace(/href="\/JS_Proyecto_Final\//g, 'href="./');
  content = content.replace(/src="\/JS_Proyecto_Final\//g, 'src="./');
  
  // Añadir script para detectar GitHub Pages si no existe
  if (!content.includes('isGitHubPages')) {
    const scriptTag = `
  <!-- Script para verificar el entorno -->
  <script>
    // Detectar si estamos en GitHub Pages
    window.addEventListener('DOMContentLoaded', function() {
      const isGitHubPages = window.location.href.includes('github.io');
      console.log('Ejecutando en GitHub Pages:', isGitHubPages);
      
      // Añadir una clase al body para aplicar estilos específicos si es necesario
      if (isGitHubPages) {
        document.body.classList.add('github-pages');
      }
    });
  </script>
</head>`;
    
    content = content.replace('</head>', scriptTag);
  }
  
  // Escribir el archivo modificado
  fs.writeFileSync(indexHtml, content, 'utf8');
  console.log('✅ Archivo index.html modificado para GitHub Pages');
  
} catch (error) {
  console.error('❌ Error al modificar el archivo index.html:', error);
  process.exit(1);
}

console.log('✅ Proceso completado. El sitio está listo para ser desplegado en GitHub Pages.');
