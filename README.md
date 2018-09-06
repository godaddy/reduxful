# Reduxful

Client-side state is often related to data requested from RESTful web services.
Reduxful aims to reduce the boilerplate for managing requested data in Redux 
state by generating **actions**, **reducers**, and **selectors** for you.

## Installation

Install `reduxful` along with `redux-thunk` middleware.

```bash
yarn add reduxful redux-thunk
```
or 
```bash
npm install --save reduxful redux-thunk
```

## Documentation 

- [API Docs]
- [Advanced setups]
- [Advanced actionCreators]
- React
  - [React Addons Docs]
  - [React Examples]

## Usage

### Describe an API

```js
// doodad-api.js

const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id'
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads'
  }
};
```

In its purest form, an [API description] is an object of keys following the 
_verbNoun_ convention by which to name a resource. The values associated
with these are the [request description], which at a minimum requires an `url`.

These resource names are also the names generated for the `actionCreators`
and `selectors`.

### Make a Request Adapter

Before we can call our endpoints, we need to set up a [Request Adapter] to use
our AJAX or Fetch library of choice. A [convenience function][makeFetchAdapter]
is available to make an adapter for the [Fetch API]. 

```js
// my-request-adapter.js

import fetch from 'cross-fetch';
import { makeFetchAdapter } from 'reduxful';

export default makeFetchAdapter(fetch);
```

In this example, we are using [cross-fetch] which allows universal fetching
on both server and browser. Any other library can be used, as long as
an adapter is implemented for adjusting params and returning the expected
Promise.

### Setup Reduxful Instance

To generate Redux tooling around an API Description, pass it along with the 
name you want your Redux state property to be. Also, include the request adapter
in the [api config] argument.

```js
// doodad-api.js

import Reduxful from 'reduxful';
import requestAdapter from './my-request-adapter';

const apiConfig = { requestAdapter };
const doodadApi = new Reduxful('doodadApi', apiDesc, apiConfig);

export default doodadApi;
```

The variable that you assign the Reduxful instance to has the
`actions`, `reducers`, and `selectors` need for working with Redux.

### Attach to Store

The first thing to using the Reduxful instance with Redux is to attach your
reducers to a Redux store.

```js
// store.js

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import doodadApi from './doodad-api';

const rootReducer = combineReducers(doodadApi.reducers);
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
```

Reduxful depends on the `redux-thunk` middleware and uses it for the 
actionCreators.

### Dispatch Actions

The Reduxful instance has an `actionCreators` property (or _`actions`_ as an
alias) from which you can dispatch action with the Redux store.

```js
import doodadApi from './doodad-api';
import store from './store';

store.dispatch(doodadApi.actionCreators.getDoodadList());

store.dispatch(doodadApi.actionCreators.getDoodad({ id: '123' }));
```

Our list resource description does not require any path or query params.
However, our single resource does require an id as a path param, so we this
in the params object as the first argument to the `actionCreator`.

### Select from State

The Reduxful instance has a `selectors` property by which you can easily 
select resources from the Redux state.

```js
import doodadApi from './doodad-api';
import store from './store';

const doodadList = doodadApi.selectors.getDoodadList(store.getState());

const doodad = doodadApi.selectors.getDoodad(store.getState(), { id: '123' });
```

To select the list resource, we only need to pass the store's state. For our
single resource, we also pass the same params used in the `actionCreator`. 
Params are used to key a resource in the redux state, which allows 
multiple requests to the same endpoint with different details to be managed. 

### Resources

[Resources] are the objects selected from Redux state and which track a
request and resulting data from its response, with properties indicating
status: `isUpdating`, `isLoaded`, and `hasError`.

```js
import doodadApi from './doodad-api';
import store from './store';

function outputResultsExample(resource) {
  if (!resource) {
    return 'No resource found.';
  } else if (resource.isUpdating && !(resource.isLoaded || resource.hasError)) {
    return 'Loading...';
  } else if (resource.isLoaded) {
    return resource.value;
  } else if (resource.hasError) {
    return resource.error;
  }
}

const doodadList = doodadApi.selectors.getDoodadList(store.getState());

outputResultsExample(doodadList);
```

In this example, except for the first request, we always return the value
or error data even if an update is occurring. When a first request is made,
or for any subsequent requests, `isUpdating` will be true. After a response,
the resource will have either `isLoaded` or `hasError` set to true.

If an action has not been dispatch, there will be no resource selected from
state. In the situation, the utility functions [isUpdating], [isLoaded], and
[hasError] can be used for checking status safely against an undefined resource.

### From here

Continue learning about Reduxful's more [advanced setups].


<!-- Links -->
[API Docs]:docs/api.md
[React Addons Docs]:docs/react-addons-api.md
[React Examples]:docs/react-examples.md
[Advanced setups]:docs/advanced-setups.md
[Advanced actionCreators]:docs/advanced-action-creators.md

[API Description]:docs/api.md#ApiDescription
[API Config]:docs/api.md#ApiDescription
[Request Description]:docs/api.md#RequestDescription
[Request Adapter]:docs/api.md#RequestAdapter
[makeFetchAdapter]:docs/api.md#makeFetchAdapter
[Resource]:docs/api.md#Resource
[Resources]:docs/api.md#Resource
[isLoaded]:docs/api.md#isLoaded
[isUpdating]:docs/api.md#isUpdating
[hasError]:docs/api.md#hasError


<!-- External Links -->
[cross-fetch]:https://github.com/lquixada/cross-fetch#cross-fetch
[redux-thunk]:https://github.com/reduxjs/redux-thunk#redux-thunk
[Fetch API]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
