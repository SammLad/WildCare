/* ===========================================================
   Wild Care — ui.js (Capa de Renderizado de Historias de Usuario)
=========================================================== */

function wcToast(message, tipo = 'success') {
  let cont = document.getElementById('wc-toast-container');
  if (!cont) {
    cont = document.createElement('div');
    cont.id = 'wc-toast-container';
    cont.style.position = 'fixed';
    cont.style.bottom = '20px';
    cont.style.right = '20px';
    cont.style.zIndex = '9999';
    document.body.appendChild(cont);
  }

  const el = document.createElement('div');
  el.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} shadow-lg border-0 rounded-4 p-3 mb-2`;
  el.style.minWidth = '300px';
  el.style.fontFamily = "'Nunito', sans-serif";
  el.innerHTML = `<i class="bi bi-info-circle-fill me-2"></i> <strong>${message}</strong>`;
  cont.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
  }, 3500);
}

function wcFileToBase64(file, callback) {
  if (!file) {
    callback('../../assets/deer.png');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

export { wcToast, wcFileToBase64 };