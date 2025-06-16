// Referencias DOM
const canvas = document.getElementById('canvas');
const themeSelect = document.getElementById('themeSelect');
const fontSelect = document.getElementById('fontSelect');
const desktopView = document.getElementById('desktopView');
const mobileView = document.getElementById('mobileView');
const generateCodeBtn = document.getElementById('generateCode');
const codeModal = document.getElementById('codeModal');
const closeModal = document.getElementById('closeModal');
const htmlPane = document.getElementById('htmlPane');
const cssPane  = document.getElementById('cssPane');
const jsPane   = document.getElementById('jsPane');

// CAMBIO DE TEMA
themeSelect.addEventListener('change', e => {
  canvas.parentElement.className = 'theme-' + e.target.value;
});

// CAMBIO DE FUENTE GLOBAL
fontSelect.addEventListener('change', e => {
  canvas.style.fontFamily = e.target.value || 'inherit';
});

// VISTAS RESPONSIVE
desktopView.addEventListener('click', () => {
  canvas.style.width = '100%'; canvas.style.height = '100%';
});
mobileView.addEventListener('click', () => {
  canvas.style.width = '375px'; canvas.style.height = '667px';
});

// AÑADIR ELEMENTOS
function addElement(type) {
  let el;
  switch(type) {
    case 'img':
      el = document.createElement('img');
      el.src = prompt('URL de la imagen:') || '';
      el.style.width = '150px';
      break;
    case 'video':
      el = document.createElement('video');
      el.src = prompt('URL del video:') || '';
      el.controls = true;
      el.style.width = '200px';
      break;
    case 'audio':
      el = document.createElement('audio');
      el.src = prompt('URL del audio:') || '';
      el.controls = true;
      break;
    case 'button':
      el = document.createElement('button');
      el.textContent = prompt('Texto del botón:') || 'Botón';
      let url = prompt('URL del enlace:');
      if (url) el.onclick = () => window.open(url, '_blank');
      break;
    default:
      el = document.createElement(type);
      el.textContent = type.toUpperCase();
  }

  el.classList.add('canvas-element');
  el.style.top = '20px'; el.style.left = '20px';
  canvas.appendChild(el);
  makeInteractable(el);
}

// INTERACT.JS (drag + resize + rotate)
function makeInteractable(el) {
  interact(el)
    .draggable({
      modifiers: [ interact.modifiers.restrict({ restriction: canvas, elementRect: { top:0, left:0, bottom:1, right:1 } }) ],
      listeners: {
        move (event) {
          let x = (parseFloat(el.getAttribute('data-x')) || 0) + event.dx;
          let y = (parseFloat(el.getAttribute('data-y')) || 0) + event.dy;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${el.getAttribute('data-rotation') || 0}deg)`;
          el.setAttribute('data-x', x);
          el.setAttribute('data-y', y);
        }
      }
    })
    .gesturable({
      listeners: {
        move(event) {
          let currentRot = parseFloat(el.getAttribute('data-rotation')) || 0;
          let newRot = currentRot + event.da;
          el.setAttribute('data-rotation', newRot);
          let x = el.getAttribute('data-x') || 0;
          let y = el.getAttribute('data-y') || 0;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${newRot}deg)`;
        }
      }
    })
    .resizable({
      edges: { left:true, right:true, bottom:true, top:true },
      modifiers: [ interact.modifiers.restrictSize({ min: { width: 20, height: 20 } }) ],
      listeners: {
        move(event) {
          let { x, y } = event.deltaRect.left || { x:0, y:0 };
          let w = event.rect.width;
          let h = event.rect.height;
          el.style.width = w + 'px';
          el.style.height = h + 'px';
          let curX = (parseFloat(el.getAttribute('data-x'))||0) + x;
          let curY = (parseFloat(el.getAttribute('data-y'))||0) + y;
          el.style.transform = `translate(${curX}px,${curY}px) rotate(${el.getAttribute('data-rotation')||0}deg)`;
          el.setAttribute('data-x', curX);
          el.setAttribute('data-y', curY);
        }
      }
    });

  // selección
  el.addEventListener('click', ev => {
    document.querySelectorAll('.canvas-element').forEach(x=>x.classList.remove('selected'));
    el.classList.add('selected');
    ev.stopPropagation();
  });
}

// deseleccionar clic fuera
canvas.parentElement.addEventListener('click', () => {
  document.querySelectorAll('.canvas-element').forEach(x=>x.classList.remove('selected'));
});

// GENERAR CÓDIGO
generateCodeBtn.addEventListener('click', () => {
  let html = canvas.innerHTML;
  let css  = `/* Estilos necesarios */\n${document.querySelector('link[rel=stylesheet]').outerHTML}`;
  let js   = `/* Código interact.js habilitado */\n// …tu script.js…`;
  htmlPane.textContent = html;
  cssPane.textContent  = css;
  jsPane.textContent   = js;
  codeModal.classList.remove('hidden');
});

// PESTAÑAS Y CERRAR MODAL
codeModal.querySelectorAll('.code-tabs button').forEach(btn=>{
  btn.onclick = () => {
    codeModal.querySelectorAll('.code-tabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['htmlPane','cssPane','jsPane'].forEach(id=>{
      document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(btn.dataset.tab + 'Pane').classList.remove('hidden');
  };
});
closeModal.addEventListener('click', ()=> codeModal.classList.add('hidden'));
