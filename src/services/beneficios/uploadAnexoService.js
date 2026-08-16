import { api } from 'boot/axios';

export async function uploadAnexo(file) {
  const formData = new FormData();
  formData.append('arquivo', file);
  const { data } = await api.post('/beneficios/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
