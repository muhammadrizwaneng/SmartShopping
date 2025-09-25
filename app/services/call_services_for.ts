import { apiClient } from '../services/client';

export const CallServiceFor = (url, method, data) => {
  if (method == 'post') {
    return apiClient.post(url, data);
  } else if (method == 'put') {
    return apiClient.put(url, data);
  } else if (method == 'delete') {
    return apiClient.delete(url, {
      data: data,
    });
  } else if (method == 'patch') {
    return apiClient.patch(url, data);
  } else {
    return apiClient.get(url);
  }
};
