# Invitación de boda — Plantilla pública y personalizable

Gracias por visitar este proyecto. Esta invitación la hice para mi hermana y la publico para que cualquiera la pueda usar, adaptar y terminar. Está pensada para parejas que quieran una invitación digital simple, con animaciones, galería y un backend mínimo para confirmar asistencia (RSVP).

![Vista previa](assets/preview.svg)

---

Características principales

- Cuenta regresiva a la fecha del evento.
- Galería de fotos con diseño tipo tarjeta.
- Sección de regalos / datos bancarios (ocultos en esta copia por privacidad).
- Backend PHP ligero para gestionar confirmaciones (RSVP).

Por favor respeta la privacidad: no subas números de cuenta, cédulas ni datos personales reales en un repositorio público.

---

Estructura del proyecto (resumen)

- `index.html` — página pública principal.
- `admin/` — archivos del panel administrativo (HTML/CSS/JS).
- `assets/` — imágenes, estilos y recursos (usa subcarpetas `assets/images`, `assets/audio` si quieres organizarlas localmente).
- `backend/` — `api.php` y `config.php` (configuración redacted por seguridad).
- `config.example.php` — plantilla de configuración (no contiene credenciales reales).

---

Cómo probar localmente (Windows + XAMPP)

1. Copia el proyecto a `c:/xampp/htdocs/invitacion5`.
2. Inicia Apache y MySQL desde el panel de XAMPP.
3. (Opcional) Importa `backend/schema.sql` si vas a usar la base de datos.
4. Configura credenciales:
   - Opción segura: establece las variables de entorno `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
   - Opción rápida: copia `config.example.php` a `backend/config.php` y rellena los valores (no subas `backend/config.php` a GitHub).

Ejemplo en PowerShell:

```powershell
setx DB_HOST "localhost"
setx DB_NAME "mi_bd"
setx DB_USER "mi_usuario"
setx DB_PASSWORD "mi_contraseña"
```

Luego abre `http://localhost/invitacion5` en tu navegador.

---

Publicar en GitHub (recomendado sin archivos pesados)

- Evita subir archivos grandes (videos, mp3s, fotos en alta resolución). Si los necesitas, usa Git LFS o súbelos a un hosting externo y enlázalos.

Comandos básicos desde la carpeta del proyecto:

```powershell
git init
git add .
git commit -m "Publicar: invitacion de boda — plantilla pública"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

---

Cómo contribuir

- Haz un fork y trabaja en una rama: `git checkout -b feat/mi-mejora`.
- Mantén los cambios puntuales y escribe mensajes de commit claros.
- No commits con datos personales ni credenciales.

Si quieres que añada un `CONTRIBUTING.md` con más detalles, lo preparo.

---

Notas para mantener limpio el repo

- Reduce imágenes grandes a tamaños web (500–1200 px de ancho) y optimiza JPEG/PNG.
- Para audio/video usa hosting externo o Git LFS.

Herramientas útiles:

- Comprimir imágenes: `magick input.jpg -resize 1200x -quality 82 output.jpg` (ImageMagick)
- Comprimir audio: `ffmpeg -i input.wav -b:a 128k output.mp3`

---

Licencia

Este proyecto se publica bajo licencia MIT. Ver `LICENSE`.

---

Contacto

Si necesitas que haga el push por ti (me puedes dar acceso al repo) o quieres que prepare versiones en inglés o una rama `gh-pages`, dímelo y lo preparo.

Hecho con cariño para mi hermana —si lo usas, cuéntame cómo quedó. 💌
# Invitación de boda

¡Hola! Soy el autor de este pequeño sitio de invitación —una invitación digital para nuestra boda— y aquí te explico cómo funciona, cómo probarlo en tu máquina y cómo publicar el proyecto protegendo la información sensible.

---

## Vista general

Este proyecto combina una página pública con animaciones y una sección de regalos, junto con un backend PHP básico para gestionar confirmaciones (RSVP). Está pensado para desplegarse localmente con XAMPP o en un hosting compatible con PHP.

Características principales:
- Página principal con cuenta regresiva, galería y sección de regalos.
- Copiar número de cuenta (los datos sensibles están ocultos en esta copia).
- Backend mínimo en `backend/` para recibir y guardar respuestas de invitados.

Nota personal

Esta invitación la hice originalmente para mi hermana que se casa; ahora la publico para que cualquiera que la encuentre pueda copiarla, adaptarla y terminar la idea. Si usas el proyecto, por favor respeta la privacidad: no subas números de cuenta, cédulas ni datos personales reales.

Si vas a personalizarla para otra boda, crea una rama o un fork y trabaja allí —me encantará ver mejoras y aportes.

## Vista previa

Agrega una imagen de ejemplo en `assets/preview.png` y se mostrará aquí.

![Vista previa](assets/preview.png)

> Si aún no tienes la imagen, pon un placeholder con ese nombre o súbela más tarde y actualiza el archivo.

---

## Preparar entorno local (Windows + XAMPP)

1. Copia el proyecto a `c:/xampp/htdocs/invitacion5`.
2. Inicia Apache y MySQL desde el panel de XAMPP.
3. Crea la base de datos usando `backend/schema.sql` si lo necesitas.
4. Configura credenciales: copia `config.example.php` a `backend/config.php` o configura variables de entorno:

Variables recomendadas:

- `DB_HOST` (por defecto `localhost`)
- `DB_NAME` (nombre de la base de datos)
- `DB_USER` (usuario de la base de datos)
- `DB_PASSWORD` (contraseña de la base de datos)

En Windows (PowerShell) puedes usar:

```powershell
setx DB_HOST "localhost"
setx DB_NAME "mi_bd"
setx DB_USER "mi_usuario"
setx DB_PASSWORD "mi_contraseña"
```

5. Abre `http://localhost/invitacion5` en tu navegador.

## Archivos importantes

- `index.html` — página pública y principal.
- `script.js` — comportamiento y animaciones (comentarios humanizados).
- `backend/config.php` — configuración de base de datos (en esta copia usa variables de entorno o valores `REDACTED`).
- `backend/api.php` — puntos de la API para RSVP.
- `config.example.php` — ejemplo de configuración (no contiene datos reales).

---

## Seguridad y privacidad

He eliminado o enmascarado datos sensibles (números de cuenta, cédulas, contraseñas) en esta copia para que sea seguro subirla a servicios públicos. Antes de desplegar en producción:

- No subas `backend/config.php` con credenciales reales.
- Usa `config.example.php` como plantilla y guarda credenciales en variables de entorno o en un archivo `.env` no versionado.

Si necesitas que vuelva a añadir valores reales para pruebas locales, dímelo y te indico cómo restaurarlos localmente sin subirlos al repo.

---

## Cómo subir a GitHub (pasos que yo no puedo ejecutar desde aquí)

En tu máquina local, desde `c:/xampp/htdocs/invitacion5`:

```powershell
# Inicializar repo (si aún no existe)
git init
git add .
git commit -m "Invitacion de boda: preparar repo, redacted datos sensibles y README"
# Crear repo en GitHub y reemplazar la URL por la tuya
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

Si quieres, puedo crear mensajes listos para el `README` en inglés o preparar una rama `gh-pages` para publicar en GitHub Pages.

---

## Contribuir

Si vas a colaborar con otras personas:

- Añade instrucciones de uso en `CONTRIBUTING.md` (puedo generarlo).
- Mantén `backend/config.php` fuera del control de versiones y comparte `config.example.php`.

---

## Licencia

Este proyecto tiene una licencia MIT incluida en el archivo `LICENSE`.

---

## Contacto

Si algo no funciona o quieres que yo haga el push por ti (necesitaría acceso a un repo o que ejecutes los comandos y me compartas el remoto), dímelo y te guío paso a paso.

¡Gracias por confiarme esto —con mucho cariño para el día especial! 💌
Proyecto web estático/dinámico para la invitación de boda. Contiene una página pública con animaciones, sección de regalos y un backend PHP pequeño para la gestión de RSVP.

## Estructura principal
- `index.html` – Página pública con detalles del evento y la sección de regalos.
- `admin/` – Panel administrativo (CSS/JS/HTML) para gestionar contenido.
- `assets/` – Imágenes y recursos estáticos.
- `backend/` – API PHP y configuración para el manejo de RSVP.

## Qué hice en esta copia
- Eliminé/oculté datos sensibles visibles en el repositorio (números de cuenta y cédula) y añadí manejo para evitar copiar datos redactados.
- Reemplacé credenciales hardcodeadas en `backend/config.php` por lecturas desde variables de entorno (fallback a marcadores `REDACTED`).
- Mejoré varios comentarios en `script.js` para que sean más claros y humanos.

> Nota: Si estás viendo valores como `REDACTED` en la interfaz o en `backend/config.php`, es intencional: protege datos sensibles antes de subir el repo a un servicio público.

## Preparar para desarrollo local (XAMPP)
1. Coloca el proyecto en la carpeta de tu servidor local (ej. `c:\xampp\htdocs\invitacion5`).
2. Asegúrate de tener PHP y MySQL corriendo (XAMPP/AMP).
3. Crea la base de datos y tablas usando `backend/schema.sql` (si aplica).
4. Define las variables de entorno para credenciales (recomendado). En Windows puedes usar un archivo `.env` o configurar tu entorno Apache/PHP.

Variables recomendadas:

- `DB_HOST` (por defecto `localhost`)
- `DB_NAME` (nombre de la base de datos)
- `DB_USER` (usuario de la base de datos)
- `DB_PASSWORD` (contraseña de la base de datos)

Ejemplo (en entorno local):

```
setx DB_HOST "localhost"
setx DB_NAME "mi_bd"
setx DB_USER "mi_usuario"
setx DB_PASSWORD "mi_contraseña"
```

O configura en `httpd.conf` / `php.ini` según prefieras.

## ¿Cómo subir esto a GitHub? (pasos rápidos)
1. Inicializa el repo si aún no lo está:

```bash
cd "c:/xampp/htdocs/invitacion5"
git init
git add .
git commit -m "Initial: Proyecto invitación (datos sensibles redacted)"
```

2. Crea un repo en GitHub y agrega el remoto:

```bash
git remote add origin https://github.com/usuario/nombre-repo.git
git push -u origin main
```

3. Antes de publicar, revisa que no haya credenciales o archivos con datos sensibles.

## .gitignore sugerido
Incluye al menos lo siguiente para evitar subir archivos generados o sensibles:

```
# Logs, OS files
.DS_Store
Thumbs.db

# Node / dep folders
node_modules/

# PHP / Server
.env
config.php

# Editor
.vscode/
```

> Consejo: No subas archivos como `backend/config.php` con credenciales reales. Si necesitas compartir un ejemplo, usa `config.example.php` con valores de ejemplo.

## Licencia
Elige la licencia que prefieras. Si no estás seguro, `MIT` es una opción permisiva y simple.

## Próximos pasos que puedo hacer por ti
- Crear `config.example.php` con instrucciones.
- Añadir un `.env` loader (tiny) y ejemplo para Windows/XAMPP.
- Preparar un `LICENSE` y plantilla de `README` en inglés si lo necesitas.

Si quieres, procedo a crear `config.example.php`, un `.gitignore` real y confirmar todo para subirlo a GitHub.
