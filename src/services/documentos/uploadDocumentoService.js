import { api } from 'boot/axios';

export async function uploadDocumento(file) {
  const formData = new FormData();
  formData.append('arquivo', file);
  const { data } = await api.post('/documentos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
