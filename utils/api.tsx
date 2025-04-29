// utils/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// const API_URL = 'https://backendimageencrypt-production.up.railway.app/api';
const API_URL = 'http://localhost:8000/api';

export async function loginUser(data: { email: string, password: string }) {
  try {
    const res = await axios.post(`${API_URL}/login`, data);

    const { token, user_id } = res.data;

    // Simpan token di cookies agar bisa dibaca middleware
    Cookies.set('token', token, {
      expires: 1, // expired dalam 1 hari
      path: '/',  // penting: agar bisa diakses semua path
    });

    Cookies.set('user_id', user_id, {
      expires: 1,
      path: '/',
    });

    return res.data;
  } catch (error) {
    throw new Error('Login gagal');
  }
}

export async function registerUser(data: { username: string, email: string, password: string }) {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  } catch (error) {
    throw new Error('Register gagal');
  }
}

export async function encryptImage(formData: FormData): Promise<Blob> {
  try {
    const token = Cookies.get('token');
    const res = await axios.post(`${API_URL}/encrypt`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Encrypt failed');
  }
}

export async function decryptImage(formData: FormData): Promise<Blob> {
  try {
    const token = Cookies.get('token');
    const res = await axios.post(`${API_URL}/decrypt`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Decrypt failed');
  }
}

export async function fetchUser() {
  try {
    const token = Cookies.get('token');
    const userId = Cookies.get('user_id');
    const res = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error('Fetch user gagal');
  }
}

export function logoutUser() {
  try {
    // Hapus semua cookies yang ada
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user_id', { path: '/' });
  } catch (error) {
    throw new Error('Logout gagal');
  }
}

export async function getHistory() {
  try {
    const token = Cookies.get('token');
    const res = await axios.get(`${API_URL}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Fetch history gagal');
  }
}
