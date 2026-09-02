import { apiClient } from './client';

export const usersApi = {
  updateLocation: (latitude: number, longitude: number) =>
    apiClient('/users/location', {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude }),
    }),
};
