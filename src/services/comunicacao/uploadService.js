import { api } from 'boot/axios';

export async function uploadMidia(file) {
  const formData = new FormData();
  formData.append('arquivo', file);
  const { data } = await api.post('/comunicacao/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
