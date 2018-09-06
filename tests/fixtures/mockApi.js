
export const mockApiName = 'mockApi';

export const mockApiDesc = {
  getFruit: {
    url: '/proto/fruits/:id',
    repeatRequestDelay: 1000
  },
  getFruits: {
    url: '/proto/fruits',
    resourceData: []
  },
  updateFruit: {
    method: 'PUT',
    url: '/proto/fruits/:id',
    resourceAlias: 'getFruit'
  },
  patchFruit: {
    method: 'PATCH',
    url: '/proto/fruits/:id',
    resourceAlias: 'getFruit'
  },
  addFruit: {
    method: 'POST',
    url: '/proto/fruits'
  },
  deleteFruit: {
    method: 'DELETE',
    url: '/proto/fruits/:id'
  },
  otherFruit: {
    url: '/proto/fruits/:id',
    resourceAlias: 'someOtherFruit'
  }
};
