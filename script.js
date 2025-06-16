// Referencias DOM
const canvasContainer = document.getElementById('canvas-container');
const canvas          = document.getElementById('canvas');
const themeSelect     = document.getElementById('themeSelect');
const fontSelect      = document.getElementById('fontSelect');
const desktopView     = document.getElementById('desktopView');
const mobileView      = document.getElementById('mobileView');
const generateCodeBtn = document.getElementById('generateCode');
const codeModal       = document.getElementById('codeModal');
const closeModal      = document.getElementById('closeModal');
const htmlPane        = document.getElementById('htmlPane');
const cssPane         = document.getElementById('cssPane');
const jsPane          = document.getElementById('jsPane');

// asegurar modal cerrado al inicio
codeModal.classList.add('hidden');
codeModal.style.display = 'none';

// Tema
themeSelect.addEventListener('change', e => {
  canvas.parentElement.className = 'theme-' + e.target.value;
});

// Fuente
fontSelect.addEventListener('change', e => {
  canvas.style.fontFamily = e.target.value || 'inherit';
});

// Vistas
desktopView.addEventListener('click', () => {
  canvasContainer.style.width  = '100%';
  canvasContainer.style.height = '100%';
});
mobileView.addEventListener('click', () => {
  canvasContainer.style.width  = '375px';
  canvasContainer.style.height = '667px';
});

// Añadir elementos con prompt de texto
function addElement(type) {
  let el;
  switch(type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'p':
      el = document.createElement(type);
      el.textContent = prompt(`Texto para ${type.toUpperCase()}:`, '') || type.toUpperCase();
      break;
    case 'img':
      el = document.createElement('img');
      el.src = prompt('URL de la imagen:', '') || '';
      el.style.width = '150px';
      break;
    case 'video':
      el = document.createElement('video');
      el.src = prompt('URL del video:', '') || '';
      el.controls = true;
      el.style.width = '200px';
      break;
    case 'audio':
      el = document.createElement('audio');
      el.src = prompt('URL del audio:', '') || '';
      el.controls = true;
      break;
    case 'button':
      el = document.createElement('button');
      el.textContent = prompt('Texto del botón:', 'Botón') || 'Botón';
      const url = prompt('URL del enlace (vacío = ninguno):', '');
      if (url) el.onclick = () => window.open(url, '_blank');
      break;
    default:
      return;
  }

  el.classList.add('canvas-element');
  el.style.top  = '20px';
  el.style.left = '20px';
  canvas.appendChild(el);
  makeInteractable(el);
}

// drag/resize/rotate con Interact.js
function makeInteractable(el) {
  interact(el)
    .draggable({
      modifiers: [ interact.modifiers.restrict({
        restriction: canvas,
        elementRect: { top:0, left:0, bottom:1, right:1 }
      })],
      listeners: {
        move(event) {
          const x = (parseFloat(el.getAttribute('data-x'))||0) + event.dx;
          const y = (parseFloat(el.getAttribute('data-y'))||0) + event.dy;
          const rot = parseFloat(el.getAttribute('data-rotation'))||0;
          el.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
        }
      }
    })
    .gesturable({
      listeners: {
        move(event) {
          const curRot = parseFloat(el.getAttribute('data-rotation'))||0;
          const newRot = curRot + event.da;
          const x = el.getAttribute('data-x')||0;
          const y = el.getAttribute('data-y')||0;
          el.setAttribute('data-rotation', newRot);
          el.style.transform = `translate(${x}px,${y}px) rotate(${newRot}deg)`;
        }
      }
    })
    .resizable({
      edges: { left:true, right:true, bottom:true, top:true },
      modifiers: [ interact.modifiers.restrictSize({ min: { width:20, height:20 } }) ],
      listeners: {
        move(event) {
          const dx = event.deltaRect.left;
          const dy = event.deltaRect.top;
          const w  = event.rect.width;
          const h  = event.rect.height;
          const x0 = parseFloat(el.getAttribute('data-x'))||0;
          const y0 = parseFloat(el.getAttribute('data-y'))||0;
          const x1 = x0 + dx;
          const y1 = y0 + dy;
          el.style.width  = w + 'px';
          el.style.height = h + 'px';
          el.setAttribute('data-x', x1);
          el.setAttribute('data-y', y1);
          const rot = parseFloat(el.getAttribute('data-rotation'))||0;
          el.style.transform = `translate(${x1}px,${y1}px) rotate(${rot}deg)`;
        }
      }
    });

  // selección
  el.addEventListener('click', ev => {
    document.querySelectorAll('.canvas-element')
      .forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    ev.stopPropagation();
  });
}

// deseleccionar
canvasContainer.addEventListener('click', () => {
  document.querySelectorAll('.canvas-element')
    .forEach(x => x.classList.remove('selected'));
});

// eliminar con tecla Supr o Backspace
window.addEventListener('keydown', e => {
  if (['Delete','Backspace'].includes(e.key)) {
    const sel = document.querySelector('.canvas-element.selected');
    if (sel) sel.remove();
  }
});

// generar código
generateCodeBtn.addEventListener('click', () => {
  const html = canvas.innerHTML;
  const css  = `<link rel="stylesheet" href="styles.css">`;
  const js   = `<script src="script.js"></script>`;

  htmlPane.textContent = html;
  cssPane.textContent  = css;
  jsPane.textContent   = js;

  codeModal.classList.remove('hidden');
  codeModal.style.display = 'flex';
});

// cambiar pestañas modal
codeModal.querySelectorAll('.code-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    codeModal.querySelectorAll('.code-tabs button')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['htmlPane','cssPane','jsPane'].forEach(id =>
      document.getElementById(id).classList.add('hidden')
    );
    document.getElementById(btn.dataset.tab + 'Pane')
      .classList.remove('hidden');
  });
});

// cerrar modal
closeModal.addEventListener('click', () => {
  codeModal.classList.add('hidden');
  codeModal.style.display = 'none';
});
