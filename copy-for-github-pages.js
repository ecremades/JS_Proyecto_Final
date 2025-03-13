const fs = require('fs');
const path = require('path');

// Rutas de los archivos
const sourceFile = path.join(__dirname, 'dist', 'github-pages-index.html');
const targetFile = path.join(__dirname, 'dist', 'index.html');

// Copiar el archivo
try {
  // Leer el contenido del archivo fuente
  const content = fs.readFileSync(sourceFile, 'utf8');
  
  // Escribir el contenido al archivo destino
  fs.writeFileSync(targetFile, content, 'utf8');
  
  console.log('✅ Archivo copiado exitosamente para GitHub Pages');
} catch (error) {
  console.error('❌ Error al copiar el archivo:', error);
}
