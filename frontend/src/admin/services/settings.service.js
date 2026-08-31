import { adminApiRequest } from './admin.client';

export const settingsService = {
  getSettings: async () => {
    return await adminApiRequest('/admin/settings');
  },

  updateSettings: async (settingsData) => {
    return await adminApiRequest('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ settings: settingsData })
    });
  }
};
