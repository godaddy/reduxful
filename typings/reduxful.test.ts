import Reduxful, { Resource, setupApi } from 'reduxful';
import requestAdapter from './fetchUtils.test';

const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id',
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads',
  },
};

const apiConfig = { requestAdapter };
const doodadApi = new Reduxful('doodadApi', apiDesc, apiConfig);

export const reduxFul = setupApi('test-name', {});

export default doodadApi;

const testResource: Resource = { value: 'test', isLoaded: true, hasError: false, isUpdating: false };

const testResourceWithShape: Resource<{ success: boolean }> = {
  value: { success: true },
  isLoaded: true,
  hasError: false,
  isUpdating: false
};