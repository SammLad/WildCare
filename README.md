# Anima Nova

Plataforma demostrativa para conectar a usuarios, rescatistas, refugios y administradores en la atención de fauna silvestre.

## Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación React ofrece un inicio público, registro de usuarios y paneles diferenciados por rol. Los datos de la demostración se guardan en el almacenamiento local del navegador.

## Ejecutar y probar el backend con el frontend

Se necesitan Python 3.10 o superior, Node.js y npm. En Windows, abre dos terminales de PowerShell desde la carpeta del proyecto.

1. En la primera terminal, prepara el entorno del backend e instala sus dependencias:

	```powershell
	cd backend
	py -m venv .venv
	.\.venv\Scripts\Activate.ps1
	python -m pip install --upgrade pip
	pip install -r requirements.txt
	```

	Si PowerShell impide activar el entorno, ejecuta `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` en esa terminal y vuelve a activar `.venv`.

2. Inicia la API desde la carpeta `backend`, manteniendo activa la terminal:

	```powershell
	python -m uvicorn app.main:app --reload
	```

	La API queda disponible en `http://127.0.0.1:8000`. Comprueba que responde abriendo `http://127.0.0.1:8000/`; también puedes abrir `http://127.0.0.1:8000/docs` para explorar y ejecutar los endpoints.

3. En la segunda terminal, desde la raíz del proyecto, inicia Vite en el puerto permitido por CORS:

	```powershell
	cd frontend
	npm install
	npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
	```

	Abre la dirección que Vite muestre, normalmente `http://127.0.0.1:5173`. Si el puerto está ocupado, detén el proceso que lo usa o cambia el puerto y añade el nuevo origen a `allow_origins` en `backend/app/main.py`.

4. Para probar una petición desde el mismo origen del frontend, abre las herramientas de desarrollador del navegador (F12), selecciona **Consola** y ejecuta:

	```javascript
	const respuesta = await fetch('http://127.0.0.1:8000/api/reportes');
	console.log(respuesta.status, await respuesta.json());
	```

	Una respuesta `200` confirma que el navegador pudo consultar la API desde el frontend. Para probar también la creación de un reporte, ejecuta:

	```javascript
	const respuesta = await fetch('http://127.0.0.1:8000/api/reportes', {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({
		 tipo: 'alerta',
		 especie: 'ave_silvestre',
		 descripcion: 'Prueba de conexión desde el frontend local.',
		 ubicacion: 'Parque de prueba'
	  })
	});
	console.log(respuesta.status, await respuesta.json());
	```

	Debe responder `201`. Luego repite la consulta `GET` para ver el reporte creado. También puedes verificar las solicitudes y sus respuestas en la pestaña **Red/Network** del navegador.

### Estado de la integración

La configuración CORS del backend permite los orígenes `http://localhost:5173` y `http://127.0.0.1:5173`. Sin embargo, actualmente las pantallas del frontend guardan sesiones y reportes en `localStorage` y no llaman a estos endpoints. Por eso, los pasos anteriores prueban que el navegador puede comunicarse con la API desde el sitio frontend, pero las acciones de la interfaz todavía no leen ni escriben datos del backend. Para una integración funcional habría que conectar esas acciones a la API.

## Cuentas de prueba

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin@animanova.com` | `Admin2026!` |
| Usuario | `usuario@animanova.com` | `Usuario2026!` |
| Rescatista | `rescatista@animanova.com` | `Rescate2026!` |
| Refugio | `refugio@animanova.com` | `Refugio2026!` |

Las cuentas de prueba se crean automáticamente en el navegador. Las contraseñas en texto y el almacenamiento local son únicamente para la simulación: no deben usarse como autenticación de producción ni para información real.

## Equipo de trabajo

| Integrante | Rol |
| --- | --- |
| Cristian Navarrete |  |
| Diana Rodriguez |  |
| Juan Henao | Backend |
| Laura Ladino | Frontend |
