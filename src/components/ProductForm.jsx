import { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const API_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:3Xncgo9I';

export default function ProductForm() {
  const [form, setForm] = useState({
    name: 'Producto nuevo',
    description: 'Descripción del nuevo producto',
    price: 1500,
    stock: 200,
    brand: 'Marca nueva',
    category: 'Categoria nueva'
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const createProductFetch = async (payload) => {
    const res = await fetch(`${API_BASE}/product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, images: [] })
    });
    if (!res.ok) throw new Error(`Error creando producto (fetch): ${res.status}`);
    return res.json();
  };

  const uploadImagesFetch = async () => {
    const fd = new FormData();
    for (const f of files) {
      fd.append('content[]', f);
    }
    const res = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      body: fd
    });
    if (!res.ok) throw new Error(`Error subiendo imágenes (fetch): ${res.status}`);
    return res.json();
  };

  const patchProductImagesFetch = async (productId, imagesArr) => {
    const res = await fetch(`${API_BASE}/product/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imagesArr })
    });
    if (!res.ok) throw new Error(`Error actualizando imágenes (fetch): ${res.status}`);
    return res.json();
  };

  const createProductAxios = async (payload) => {
    const { data } = await axios.post(`${API_BASE}/product`, { ...payload, images: [] });
    return data;
  };

  const uploadImagesAxios = async () => {
    const fd = new FormData();
    for (const f of files) {
      fd.append('content[]', f);
    }
    const { data } = await axios.post(`${API_BASE}/upload/image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  };

  const patchProductImagesAxios = async (productId, imagesArr) => {
    const { data } = await axios.patch(`${API_BASE}/product/${productId}`, { images: imagesArr });
    return data;
  };

  const handleSubmitFetch = async () => {
    setLoading(true);
    setStatus('Paso 1 (fetch): creando producto...');
    setResult(null);
    try {
      const created = await createProductFetch(form);
      const productId = created.id;
      setStatus(`Paso 1 completo. ID: ${productId}. Paso 2 (fetch): subiendo imágenes...`);

      const uploadedImages = await uploadImagesFetch();
      setStatus(`Paso 2 completo (${uploadedImages.length} imágenes). Paso 3 (fetch): actualizando producto...`);

      const updated = await patchProductImagesFetch(productId, uploadedImages);
      setStatus('Proceso (fetch) completado.');
      setResult({ created, uploadedImages, updated });
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAxios = async () => {
    setLoading(true);
    setStatus('Paso 1 (axios): creando producto...');
    setResult(null);
    try {
      const created = await createProductAxios(form);
      const productId = created.id;
      setStatus(`Paso 1 completo. ID: ${productId}. Paso 2 (axios): subiendo imágenes...`);

      const uploadedImages = await uploadImagesAxios();
      setStatus(`Paso 2 completo (${uploadedImages.length} imágenes). Paso 3 (axios): actualizando producto...`);

      const updated = await patchProductImagesAxios(productId, uploadedImages);
      setStatus('Proceso (axios) completado.');
      setResult({ created, uploadedImages, updated });
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Crear Producto con Imágenes (Xano)</h1>
      <form className="product-form" onSubmit={(e) => e.preventDefault()}>
        <div className="grid">
          <label>
            Nombre
            <input name="name" value={form.name} onChange={onChange} />
          </label>
          <label>
            Descripción
            <textarea name="description" value={form.description} onChange={onChange} />
          </label>
          <label>
            Precio
            <input type="number" name="price" value={form.price} onChange={onChange} />
          </label>
          <label>
            Stock
            <input type="number" name="stock" value={form.stock} onChange={onChange} />
          </label>
          <label>
            Marca
            <input name="brand" value={form.brand} onChange={onChange} />
          </label>
          <label>
            Categoría
            <input name="category" value={form.category} onChange={onChange} />
          </label>
          <label className="file-label">
            Imágenes (múltiples)
            <input type="file" multiple accept="image/*" onChange={onFilesChange} />
          </label>
        </div>

        <div className="actions">
          <button type="button" disabled={loading || files.length === 0} onClick={handleSubmitFetch}>
            Enviar con Fetch
          </button>
          <button type="button" disabled={loading || files.length === 0} onClick={handleSubmitAxios}>
            Enviar con Axios
          </button>
        </div>
      </form>

      <div className="status">
        <strong>Estado:</strong> {status}
      </div>

      {result && (
        <div className="result">
          <h2>Resultado</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}