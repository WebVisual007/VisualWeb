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

// Función para seleccionar un elemento: le agrega una clase "selected" y, si es texto, le pone el handle de redimensionado
function selectElement(elem) {
  // Quitar selección previa
  if (selectedElement) {
    selectedElement.classList.remove('selected');
    // Eliminar el handle si existe
    const existingHandle = selectedElement.querySelector('.resize-handle');
    if (existingHandle) {
      existingHandle.remove();
    }
  }
  selectedElement = elem;
  selectedElement.classList.add('selected');
  // Si el elemento es de texto, agregar el handle para redimensionar
  if (['H1', 'H2', 'P'].includes(selectedElement.tagName)) {
    createResizeHandle(selectedElement);
  }
}

// Función para crear un handle de redimensionado en el elemento seleccionado (solo textos)
function createResizeHandle(elem) {
  // Si ya existe, no se vuelve a crear
  if (elem.querySelector('.resize-handle')) return;
  
  const handle = document.createElement('div');
  handle.classList.add('resize-handle');
  elem.appendChild(handle);
  
  // Al presionar el handle se inicia el proceso de redimensionar (ajustando el tamaño de la fuente)
  handle.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const styleFontSize = window.getComputedStyle(elem).fontSize;
    const originalFontSize = parseInt(styleFontSize, 10) || 24;
    
    function onMouseMove(eMove) {
      const dx = eMove.clientX - startX;
      let newFontSize = originalFontSize + dx;
      if (newFontSize < 10) newFontSize = 10; // tamaño mínimo
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

  textElem.addEventListener('dragstart', dragStart);
  textElem.addEventListener('dragend', dragEnd);

  // Al hacer clic sobre el texto se selecciona para mover/redimensionar
  textElem.addEventListener('click', function(e) {
    e.stopPropagation();
    selectElement(textElem);
  });

  document.getElementById('workspace').appendChild(textElem);
  document.getElementById('textContent').value = '';
}

// Función para agregar una imagen desde el input file
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

    // Al hacer clic en la imagen se selecciona y se abre el modal de edición
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      selectElement(img);
      currentImageElement = img;
      openImageModal();
    });

    img.setAttribute('draggable', true);
    img.addEventListener('dragstart', dragStart);
    img.addEventListener('dragend', dragEnd);

    document.getElementById('workspace').appendChild(img);
  }
  reader.readAsDataURL(file);
}

// Función para agregar un botón personalizado
function addButton() {
  const text = document.getElementById('btnText').value || 'Botón';
  const color = document.getElementById('btnColor').value;
  const width = document.getElementById('btnWidth').value;
  const height = document.getElementById('btnHeight').value;
  const link = document.getElementById('btnLink').value;
  const animation = document.getElementById('btnAnimation').value;

  const btn = document.createElement('a');
  btn.innerText = text;
  btn.href = link || '#';
  btn.style.display = 'inline-block';
  btn.style.backgroundColor = color;
  btn.style.width = width + 'px';
  btn.style.height = height + 'px';
  btn.style.lineHeight = height + 'px';
  btn.style.textAlign = 'center';
  btn.style.position = 'absolute';
  btn.style.top = '100px';
  btn.style.left = '100px';
  btn.style.textDecoration = 'none';
  btn.style.color = '#fff';
  btn.classList.add('element', 'custom-button');
  if (animation) {
    btn.style.animation = animation + ' 2s infinite';
  }
  btn.setAttribute('draggable', true);
  btn.addEventListener('dragstart', dragStart);
  btn.addEventListener('dragend', dragEnd);

  // Al hacer clic, se selecciona el botón
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    selectElement(btn);
  });

  document.getElementById('workspace').appendChild(btn);
}

// Función para agregar un "cuaderno" (simulador) al espacio de trabajo
function addNotebook() {
  const type = document.getElementById('notebookType').value;
  const notebook = document.createElement('div');
  notebook.classList.add('notebook');
  if (type === 'circular') {
    notebook.classList.add('circular');
  }
  notebook.innerHTML = '<p>Este es un cuaderno ' + (type === 'circular' ? 'circular' : 'cuadrado') + '.</p>';
  notebook.style.position = 'absolute';
  notebook.style.top = '150px';
  notebook.style.left = '150px';
  notebook.setAttribute('draggable', true);
  notebook.addEventListener('dragstart', dragStart);
  notebook.addEventListener('dragend', dragEnd);

  // Al hacer clic, se selecciona el cuaderno
  notebook.addEventListener('click', function(e) {
    e.stopPropagation();
    selectElement(notebook);
  });

  document.getElementById('workspace').appendChild(notebook);
}

// Funciones básicas de arrastrar y soltar
let offsetX, offsetY;
function dragStart(e) {
  offsetX = e.offsetX;
  offsetY = e.offsetY;
}
function dragEnd(e) {
  e.target.style.left = (e.pageX - offsetX) + 'px';
  e.target.style.top = (e.pageY - offsetY) + 'px';
}

// Manejo del modal de edición de imagen
function openImageModal() {
  document.getElementById('imageModal').classList.remove('hidden');
}
function closeImageModal() {
  document.getElementById('imageModal').classList.add('hidden');
}
function applyImageEdits() {
  if (currentImageElement) {
    const scale = document.getElementById('imgScale').value;
    const rotate = document.getElementById('imgRotate').value;
    const filter = document.getElementById('imgFilter').value;
    currentImageElement.style.transform = 'scale(' + scale + ') rotate(' + rotate + 'deg)';
    currentImageElement.style.filter = filter;
    closeImageModal();
  }
}

// Generador de código: recopila el contenido del espacio de trabajo y muestra ejemplos de HTML, CSS y JS
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

  document.getElementById('codeModal').classList.remove('hidden');
}
function closeCodeModal() {
  document.getElementById('codeModal').classList.add('hidden');
}

// Evento para deseleccionar el elemento si se hace clic en el fondo del workspace
document.getElementById('workspace').addEventListener('click', function(e) {
  if (e.target.id === 'workspace') {
    if (selectedElement) {
      selectedElement.classList.remove('selected');
      selectedElement = null;
    }
  }
});
