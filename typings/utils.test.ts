import { isLoaded, isUpdating, hasError, getResourceKey } from 'reduxful';

isLoaded();
isLoaded(null);
isLoaded({ isLoaded: false });

isUpdating();
isUpdating(null);
isUpdating({ isUpdating: false });

hasError();
hasError(null);
hasError({ hasError: false });

const params = {
  id: 'user123',
  count: 777,
};

getResourceKey('test', params);
getResourceKey('test');
