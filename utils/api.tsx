import axios from 'axios';
import Cookies from 'js-cookie';

// Ganti ke URL production jika perlu
const API_URL = 'http://localhost:8000/api';
// const API_URL = 'https://backendimageencrypt-production.up.railway.app/api';

// Helper untuk ambil token
const getToken = () => Cookies.get('token');

// Helper untuk header auth
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Helper request GET dengan auth
const getWithAuth = (url: string) =>
  axios.get(url, { headers: authHeader() }).then(res => res.data);

// Helper request DELETE dengan auth
const deleteWithAuth = (url: string) =>
  axios.delete(url, { headers: authHeader() }).then(res => res.data);

// Helper request PUT dengan auth
const putWithAuth = (url: string, data: any) =>
  axios.put(url, data, { headers: authHeader() }).then(res => res.data);

// Helper request POST dengan auth
const postWithAuth = (url: string, data: any, config: any = {}) =>
  axios.post(url, data, { ...config, headers: { ...authHeader(), ...(config.headers || {}) } }).then(res => res.data);

// AUTH
export async function loginUser(data: { email: string; password: string }) {
  const res = await axios.post(`${API_URL}/login`, data);
  const { token, user_email } = res.data;
  Cookies.set('token', token, { expires: 1, path: '/' });
  Cookies.set('user_email', user_email, { expires: 1, path: '/' });
  return res.data;
}

export async function registerUser(data: { username: string; email: string; password: string }) {
  return (await axios.post(`${API_URL}/register`, data)).data;
}

// ENKRIPSI/DEKRIPSI
export async function encryptImage(formData: FormData, method: 'basic' | 'advanced' = 'basic'): Promise<Blob> {
  try {
    formData.append('method', method);
    const res = await axios.post(`${API_URL}/encrypt`, formData, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
    return res.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Encrypt failed');
  }
}

export async function decryptImage(formData: FormData, method: 'basic' | 'advanced' = 'basic'): Promise<Blob> {
  try {
    formData.append('method', method);
    const res = await axios.post(`${API_URL}/decrypt`, formData, {
      headers: authHeader(),
      responseType: 'blob',
    });
    return res.data;
  } catch (e: any) {
    throw e;
  }
}

// USER STATUS & INFO
export async function getUserStatus(): Promise<{
  username: string;
  status: 'active' | 'blocked';
  block_until: string;
}> {
  try {
    return await getWithAuth(`${API_URL}/user-status`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Fetch status gagal');
  }
}

export async function fetchUser() {
  try {
    return await getWithAuth(`${API_URL}/getcurrentuser`);
  } catch {
    throw new Error('Fetch user gagal');
  }
}

export function logoutUser() {
  try {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user_id', { path: '/' });
  } catch {
    throw new Error('Logout gagal');
  }
}

// HISTORY
export async function getHistory() {
  try {
    return await getWithAuth(`${API_URL}/history`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Fetch history gagal');
  }
}

// LOGIN BLOCK STATUS
export async function loginBlockStatus(email: string): Promise<{
  is_blocked: boolean;
  block_until: string | null;
}> {
  try {
    const res = await axios.get(`${API_URL}/login-block-status`, { params: { email } });
    return res.data;
  } catch {
    return { is_blocked: false, block_until: null };
  }
}

// USER MANAGEMENT
export async function editUser(
  userId: number,
  data: { username?: string; email?: string; role?: string; is_blocked?: boolean }
) {
  try {
    return await putWithAuth(`${API_URL}/users/${userId}`, data);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Update user gagal');
  }
}

export async function deleteUser(userId: number) {
  try {
    return await deleteWithAuth(`${API_URL}/users/${userId}`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Hapus user gagal');
  }
}

export async function fetchAllUsers() {
  try {
    return await getWithAuth(`${API_URL}/users`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Fetch users gagal');
  }
}

// DASHBOARD ADMIN
export async function getDashboardData(): Promise<{
  total_login_failed: number;
  total_decrypt_failed: number;
  users: Array<{
    username: string;
    email: string;
    created_at: string;
  }>;
  total_users: number;
  total_history: number;
}> {
  try {
    return await getWithAuth(`${API_URL}/users/dashboard`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Fetch dashboard data gagal');
  }
}

// FAQ
export async function getAllFaq() {
  try {
    const res = await getWithAuth(`${API_URL}/faq`);
    return res.faq;
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Fetch FAQ gagal');
  }
}

export async function addFaq(data: { pertanyaan: string; jawaban: string }) {
  try {
    return await postWithAuth(`${API_URL}/faq`, data);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Tambah FAQ gagal');
  }
}

export async function updateFaq(faqId: number, data: { pertanyaan?: string; jawaban?: string }) {
  try {
    return await putWithAuth(`${API_URL}/faq/${faqId}`, data);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Update FAQ gagal');
  }
}

export async function deleteFaq(faqId: number) {
  try {
    return await deleteWithAuth(`${API_URL}/faq/${faqId}`);
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Hapus FAQ gagal');
  }
}

// OTP
export async function sendOtp(data: { email: string }) {
  try {
    const res = await axios.post(`${API_URL}/send-otp`, data);
    return res.data;
  } catch (e: any) {
    // Bisa ambil e.response.data.message atau e.response.data.error
    throw new Error(e.response?.data?.error || 'Gagal mengirim OTP');
  }
}

// VERIFY OTP
export async function verifyOtp(data: { email: string; otp: string; new_password: string }) {
  try {
    const res = await axios.post(`${API_URL}/verify-otp`, data);
    return res.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.error || 'Gagal verifikasi OTP');
  }
}
