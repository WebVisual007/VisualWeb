const fuenteSelector = document.getElementById("fuenteSelector");
const zonaDiseño = document.getElementById("zonaDiseño");
const temaSelector = document.getElementById("temaSelector");

// Cargar fuentes
const fuentes = [
  "Arial", "Verdana", "Tahoma", "Georgia", "Courier New", "Trebuchet MS",
  "Lucida Console", "Comic Sans MS", "Impact", "Palatino", "Garamond",
  "Brush Script MT", "Candara", "Optima", "Futura", "Segoe UI", "Roboto",
  "Montserrat", "Open Sans", "Lato"
];
fuentes.forEach(fuente => {
  const opcion = document.createElement("option");
  opcion.value = fuente;
  opcion.textContent = fuente;
  fuenteSelector.appendChild(opcion);
});

fuenteSelector.addEventListener("change", () => {
  zonaDiseño.style.fontFamily = fuenteSelector.value;
});

// Cambiar tema visual
temaSelector.addEventListener("change", () => {
  document.body.className = "tema-" + temaSelector.value;
});

// Agregar elementos
function agregarElemento(tipo) {
  let nuevo;
  if (tipo === "img") {
    nuevo = document.createElement("img");
    nuevo.src = prompt("URL de la imagen:");
    nuevo.style.maxWidth = "100%";
  } else if (tipo === "boton") {
    nuevo = document.createElement("button");
    nuevo.textContent = prompt("Texto del botón:");
    const url = prompt("URL al hacer clic:");
    nuevo.onclick = () => window.open(url, "_blank");
    nuevo.classList.add("efecto-boton");
  } else {
    nuevo = document.createElement(tipo);
    nuevo.textContent = prompt(`Contenido para ${tipo}:`);
  }
  zonaDiseño.appendChild(nuevo);
}

// Exportar código
document.getElementById("btnExportar").addEventListener("click", () => {
  const resultado = zonaDiseño.innerHTML;
  document.getElementById("codigoResultado").value = resultado;
});
