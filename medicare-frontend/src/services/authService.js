import API from './api';

export const loginRequest = (email, password, role) =>
  API.post('/auth/login', { email, password, role }).then(r => r.data);

export const registerPatientRequest = (payload) =>
  API.post('/auth/register-patient', payload).then(r => r.data);

