// Asegurar que el modal esté oculto al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  const codeModal = document.getElementById('codeModal');
  if (codeModal) {
    codeModal.classList.add('hidden');
    codeModal.style.display = "none"; // Oculta el modal completamente
  }
});

let currentImageElement = null;
let selectedElement = null;

// Listener global de teclas: mueve el elemento seleccionado con las flechas del teclado
document.addEventListener('keydown', function(e) {
  if (selectedElement) {
    const step = 5; // píxeles de movimiento por pulsación
    let left = parseInt(selectedElement.style.left, 10) || 0;
    let top = parseInt(selectedElement.style.top, 10) || 0;
    if (e.key === 'ArrowLeft') {
      selectedElement.style.left = (left - step) + 'px';
    } else if (e.key === 'ArrowRight') {
      selectedElement.style.left = (left + step) + 'px';
    } else if (e.key === 'ArrowUp') {
      selectedElement.style.top = (top - step) + 'px';
    } else if (e.key === 'ArrowDown') {
      selectedElement.style.top = (top + step) + 'px';
    }
  }
});

// Función para abrir el modal al generar código
function generateCode() {
  const workspaceContent = document.getElementById('workspace').innerHTML;
  const htmlCode = `<!DOCTYPE html>
<html>
<head>
  <title>Mi Sitio Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${workspaceContent}
  <script src="script.js"><\/script>
</body>
</html>`;
  const cssCode = document.querySelector('link[rel="stylesheet"]').sheet.ownerNode ?
    document.querySelector('link[rel="stylesheet"]').sheet.ownerNode.textContent : "";
  const jsCode = document.querySelector('script[src="script.js"]') ? "Revisa el archivo script.js" : "";

  document.getElementById('codeHtml').innerText = htmlCode;
  document.getElementById('codeCss').innerText = cssCode;
  document.getElementById('codeJs').innerText = jsCode;

  const codeModal = document.getElementById('codeModal');
  if (codeModal) {
    codeModal.classList.remove('hidden');
    codeModal.style.display = "block"; // Asegurar que el modal se muestre correctamente
  }
}

// Función para cerrar el modal
function closeCodeModal() {
  const codeModal = document.getElementById('codeModal');
  if (codeModal) {
    codeModal.classList.add('hidden');
    codeModal.style.display = "none"; // Asegurar que el modal se oculte completamente
  }
}
