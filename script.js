// Asegurar que los modales estén ocultos al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  const codeModal = document.getElementById('codeModal');
  if (codeModal) {
    codeModal.classList.add('hidden');
    codeModal.style.display = "none";
  }

  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.classList.add('hidden');
    imageModal.style.display = "none";
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

// Función para seleccionar un elemento y darle estilo de selección
function selectElement(elem) {
  if (selectedElement) {
    selectedElement.classList.remove('selected');
    const existingHandle = selectedElement.querySelector('.resize-handle');
    if (existingHandle) {
      existingHandle.remove();
    }
  }
  selectedElement = elem;
  selectedElement.classList.add('selected');
  if (['H1', 'H2', 'P'].includes(selectedElement.tagName)) {
    createResizeHandle(selectedElement);
  }
}

// Función para crear un handle de redimensionado en elementos de texto
function createResizeHandle(elem) {
  if (elem.querySelector('.resize-handle')) return;
  const handle = document.createElement('div');
  handle.classList.add('resize-handle');
  elem.appendChild(handle);
  
  handle.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const originalFontSize = parseInt(window.getComputedStyle(elem).fontSize, 10) || 24;
    
    function onMouseMove(eMove) {
      const dx = eMove.clientX - startX;
      let newFontSize = originalFontSize + dx;
      if (newFontSize < 10) newFontSize = 10;
      elem.style.fontSize = newFontSize + 'px';
    }
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// Función para agregar texto con las opciones seleccionadas
function addText() {
  const content = document.getElementById('textContent').value;
  const type = document.getElementById('textType').value;
  const font = document.getElementById('fontSelect').value;
  const fontSize = document.getElementById('fontSize').value;
  const color = document.getElementById('fontColor').value;

  if (!content) {
    alert('Por favor ingrese contenido de texto.');
    return;
  }
  const textElem = document.createElement(type);
  textElem.innerText = content;
  textElem.style.position = 'absolute';
  textElem.style.top = '10px';
  textElem.style.left = '10px';
  textElem.style.fontFamily = font;
  textElem.style.fontSize = fontSize + 'px';
  textElem.style.color = color;
  textElem.classList.add('element');
  textElem.setAttribute('draggable', true);
  textElem.addEventListener('click', function(e) {
    e.stopPropagation();
    selectElement(textElem);
  });

  document.getElementById('workspace').appendChild(textElem);
  document.getElementById('textContent').value = '';
}

// Función para agregar una imagen y abrir el modal de edición al hacer clic
function addImage() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert('Seleccione un archivo de imagen.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.position = 'absolute';
    img.style.top = '50px';
    img.style.left = '50px';
    img.style.width = '200px';
    img.style.cursor = 'pointer';
    img.classList.add('element');
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      selectElement(img);
      currentImageElement = img;
      openImageModal();
    });

    document.getElementById('workspace').appendChild(img);
  }
  reader.readAsDataURL(file);
}

// Función para abrir el modal de edición de imagen
function openImageModal() {
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.classList.remove('hidden');
    imageModal.style.display = "block"; 
  }
}

// Función para cerrar el modal de edición de imagen
function closeImageModal() {
  const imageModal = document.getElementById('imageModal');
  if (imageModal) {
    imageModal.classList.add('hidden');
    imageModal.style.display = "none"; 
  }
}

// Función para aplicar cambios a la imagen
function applyImageEdits() {
  if (currentImageElement) {
    const scale = document.getElementById('imgScale').value;
    const rotate = document.getElementById('imgRotate').value;
    const filter = document.getElementById('imgFilter').value;
    currentImageElement.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
    currentImageElement.style.filter = filter;
    closeImageModal();
  }
}

// Función para abrir el modal de código generado
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
  document.getElementById('codeHtml').innerText = htmlCode;
  document.getElementById('codeModal').classList.remove('hidden');
  document.getElementById('codeModal').style.display = "block"; 
}

// Función para cerrar el modal de código generado
function closeCodeModal() {
  const codeModal = document.getElementById('codeModal');
  if (codeModal) {
    codeModal.classList.add('hidden');
    codeModal.style.display = "none"; 
  }
}

// Evento para deseleccionar elementos en el workspace
document.getElementById('workspace').addEventListener('click', function(e) {
  if (e.target.id === 'workspace' && selectedElement) {
    selectedElement.classList.remove('selected');
    selectedElement = null;
  }
});
