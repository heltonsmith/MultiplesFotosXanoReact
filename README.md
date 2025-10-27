# MultiplesFotosXanoReact

Aplicación React + Vite para crear un producto y subir múltiples imágenes a una API REST en Xano, ejecutando un flujo de 3 pasos. Incluye dos implementaciones: una con `fetch` y otra con `axios`, y un formulario con CSS personalizado.

## Requisitos
- Node.js 18+

## Ejecución local
```bash
npm install
npm run dev
```
Abre `http://localhost:5173/` en el navegador.

## Estructura del proyecto
- `src/components/ProductForm.jsx`: componente de formulario y lógica de llamadas a Xano.
- `src/components/ProductForm.css`: estilos del formulario.
- `src/App.jsx`: renderiza `ProductForm`.

## Qué hace la app
- Muestra un formulario con los campos: `name`, `description`, `price`, `stock`, `brand`, `category` y selector de archivos múltiples para imágenes.
- Dos botones de envío:
  - "Enviar con Fetch": usa `fetch` para los 3 pasos.
  - "Enviar con Axios": usa `axios` para los 3 pasos.
- Muestra el estado paso a paso y el resultado final en JSON.

## Flujo en 3 pasos (detallado)
1) Crear producto (sin imágenes)
   - POST a `https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/product`
   - Body:
   ```json
   {
     "name": "Producto nuevo",
     "description": "Descripción del nuevo producto",
     "price": 1500,
     "stock": 200,
     "brand": "Marca nueva",
     "category": "Categoria nueva",
     "images": []
   }
   ```
   - La respuesta incluye `id` del nuevo producto; se guarda para el siguiente paso.

2) Subir imágenes (multipart/form-data)
   - POST a `https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/upload/image`
   - Enviar cada imagen en `FormData` con la misma clave: `content[]`.
   - La respuesta es un array con metadatos por imagen (path, name, size, mime, meta.width/meta.height).

3) Actualizar el producto con imágenes
   - PATCH a `https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/product/{product_id}`
   - Body:
   ```json
   { "images": [ /* array devuelto en el paso 2 */ ] }
   ```

## Explicación del código (ProductForm.jsx)
- `API_BASE`: base de la API de Xano.
- Estado del formulario: mantiene los campos del producto y los archivos seleccionados.
- Implementaciones por técnica:
  - `createProductFetch(payload)` / `createProductAxios(payload)`: Paso 1, crea producto con `images: []`.
  - `uploadImagesFetch()` / `uploadImagesAxios()`: Paso 2, usa `FormData` y adjunta cada archivo en `content[]`.
  - `patchProductImagesFetch(id, images)` / `patchProductImagesAxios(id, images)`: Paso 3, actualiza `images` del producto.
- Acciones del usuario:
  - `handleSubmitFetch()` y `handleSubmitAxios()` encadenan los 3 pasos, gestionan estados (`loading`, `status`) y muestran el resultado (`created`, `uploadedImages`, `updated`).

## Cómo usar la UI
- Completa los campos del producto (vienen con valores de ejemplo).
- Selecciona múltiples imágenes.
- Pulsa "Enviar con Fetch" o "Enviar con Axios".
- Observa el progreso en "Estado:" y el `JSON` final en "Resultado".

## Prompt del usuario (completo)
```
Necesito crear un poyecto React + Vite con el nombre "MultiplesFotosXanoReact" para subir multiples imagenes a una api rest construida en xano.com, crea un botón para hacerlo con fetch y otro botón para hacerlo con axios.
 
 El proceso se desarrollará en 3 pasos.
 Paso 1: Post a /product (esperar retorno de nuevo id de producto)
 Paso 2: Post a /upload/image (esperar array de imágenes subidas a xano)
 Paso 3: Patch a /product/{id de nuevo producto creado en el paso 1} (enviandole como body en array de imagenes que devuelve xano en el paso 2)
 
 A continuación detallo información importante de cada paso:
 
 Ayudame a crear el componente formulario con un css personalizado
 
  
 
El formulario debe poder enviar estos campos a la api rest:
{
  "name": "",
  "description": "",
  "price": 0,
  "stock": 0,
  "brand": "",
  "category": "",
  "images": []
}
 
 Necesito que sea en 3 pasos:
 
 Paso 1:
 Post con una funcion asincrona al endpoint: 
 https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/product
 
 con un body como el siguiente:
 {
   "name": "Producto nuevo",
   "description": "Descripción del nuevo producto",
   "price": 1500,
   "stock": 200,
   "brand": "Marca nueva",
   "category": "Categoria nueva",
   "images": []
 }
 
 Este primer paso enviará solo los campos json (sin imagenes)
 La api responderá un producto con un nuevo id creado, como el siguiente:
 {
   "id": 25,
   "created_at": 1761536491370,
   "name": "Producto nuevo",
   "description": "Descripción del nuevo producto",
   "price": 1500,
   "stock": 200,
   "brand": "Marca nueva",
   "category": "Categoria nueva",
   "images": []
 }
 
 se debe almacenar el id porque lo utilizaremos más adelante.
 
 Paso 2:
 Post con una funcion asincrona al endpoint: 
 https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/upload/image
 
 Es este paso debes enviar imagenes en formato multipart/form-data sin json
 cada imagen seleccionada se debe subir con el mismo nombre de array: 
 content[]
 
 Cuando se suben las imágenes al bucket de xano (utilizando el endpoint), el servidor de xano responde el siguiente json, aqui un ejemplo:
 [
   {
     "access": "public",
     "path": "/vault/dAP3Ozc8/3_4rb6IFawf7zvmAvMdyIGTMpaI/289ycg../GOPR0285.JPG",
     "name": "GOPR0285.JPG",
     "type": "image",
     "size": 5255720,
     "mime": "application/octet-stream",
     "meta": {
       "width": 4000,
       "height": 3000
     }
   },
   {
     "access": "public",
     "path": "/vault/dAP3Ozc8/lK3YHpElmPyoga9ITrtQZHlQZYk/QTCTVQ../Screenshot_3.jpg",
     "name": "Screenshot_3.jpg",
     "type": "image",
     "size": 82812,
     "mime": "image/jpeg",
     "meta": {
       "width": 452,
       "height": 803
     }
   }
 ]
 
 una vez que el servidor responde el array de de imagenes subidas a xano, se debe ejecutar el paso 3.
 
 Paso 3:
 Patch con una funcion asincrona al endpoint: 
 https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I/product/{product_id}
 
 El product_id es el id del producto nuevo creado en el paso 1.
 
 El patch se debe realizar con el siguiente body de ejemplo:
 
 Solo indicando el array images[] en el body:
 
 {
 "images": [
   {
     "access": "public",
     "path": "/vault/dAP3Ozc8/3_4rb6IFawf7zvmAvMdyIGTMpaI/289ycg../GOPR0285.JPG",
     "name": "GOPR0285.JPG",
     "type": "image",
     "size": 5255720,
     "mime": "application/octet-stream",
     "meta": {
       "width": 4000,
       "height": 3000
     }
   },
   {
     "access": "public",
     "path": "/vault/dAP3Ozc8/lK3YHpElmPyoga9ITrtQZHlQZYk/QTCTVQ../Screenshot_3.jpg",
     "name": "Screenshot_3.jpg",
     "type": "image",
     "size": 82812,
     "mime": "image/jpeg",
     "meta": {
       "width": 452,
       "height": 803
     }
   }
 ]
 }
 
 Cada paso debe ejecutarse en orden... 
 
 El paso 1 debe esperar el id del producto nuevo creado.
 
 Luego continuar con el paso 2 y esperar que devuelva el array con imagenes subidas al bucket de xano.
 
 Finalmente ejecutar el paso 3 haciendo una actualización a images[] con el array devuelto en el paso 2.
```

## Notas y recomendaciones
- CORS: asegúrate de permitir tu origen en la configuración de Xano si aparece un error de CORS.
- Validación de archivos: si tu bucket tiene límites, añade checks de tamaño/tipo antes de subir.
- Mejora sugerida: mover `API_BASE` a un `.env` y usar `import.meta.env`.
