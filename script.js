let currentImageElement = null;

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

    // Al hacer clic en la imagen se abre el modal de edición
    img.addEventListener('click', function() {
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
  // Se obtienen el CSS y JS actuales (en un proyecto real podrías generar archivos separados)
  const cssCode = document.querySelector('link[rel="stylesheet"]').sheet.ownerNode ? document.querySelector('link[rel="stylesheet"]').sheet.ownerNode.textContent : "";
  const jsCode = document.querySelector('script[src="script.js"]') ? "Revisa el archivo script.js" : "";

  document.getElementById('codeHtml').innerText = htmlCode;
  document.getElementById('codeCss').innerText = cssCode;
  document.getElementById('codeJs').innerText = jsCode;

  document.getElementById('codeModal').classList.remove('hidden');
}
function closeCodeModal() {
  document.getElementById('codeModal').classList.add('hidden');
}
