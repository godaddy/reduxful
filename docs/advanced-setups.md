# Advanced Setups

There are several options available when describing an API's endpoints. 

Continuing from our `doodadApi` setup from the [usage docs], let us look at 
using some additional options to fill out our API description.


## `method`

Let's add an endpoint to create new doodads. To do so, we need to set up a POST
to our API. Simply add a `createDoodad` entry with and set the request
description [method] to `POST`.


```diff
const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id'
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads'
+   },
+   createDoodad: {
+     url: 'http://api.my-service.com/doodads',
+     method: 'POST'
  }
};
```

Now, we can dispatch the new **actionCreator** with [body options] to create a 
new doodad, and use the **selector** to get results from state.

```js
import doodadApi from './doodad-api';
import store from './store';

const { actionCreators, selectors } = doodadApi;

// Make a new doodad

const body = { name: 'some-name', details: { stuff: 'here' }};
store.dispatch(actionCreators.createDoodad(null, { body }));

// Select resulting new doodad resource

const newDoodadResource = selectors.createDoodad(store.getState());
```

Because no query or path params are needed for this endpoint, we pass `null`
as the first param to the actionCreator. Remember, however, params are used to
key a particular resource, so this means all new POSTed doodads will update
the resource on redux state.

There are a couple things you can do from here depending on your applications
needs. See [advanced actionCreators] for some examples.


## `resourceAlias`

Now that we are creating new doodads, let us look at tying into our API to
update them. Resources are keyed by params, but also by the endpoint name. If
we want an PUT request to modify a resource we already have from a GET, 
can set the [resourceAlias] in our request description.

```diff
const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id'
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads'
  },
  createDoodad: {
    url: 'http://api.my-service.com/doodads',
    method: 'POST'
+   },
+   updateDoodad: {
+     url: 'http://api.my-service.com/doodads/:id',
+     method: 'PUT',
+     resourceAlias: 'getDoodad'
  }
};
```

Now, any change from updateDoodad will end up in redux state under the 
corresponding getDoodad resource. So say we have a doodad whose name we want
to change:

```js
import doodadApi from './doodad-api';
import store from './store';

const { actionCreators, selectors } = doodadApi;

// Select a doodad

let doodad = selectors.getDoodad(store.getState(), { id: '123' });
console.log(doodad.value.name, doodad.isUpdating); // some-name, false

// Dispatch an update to the doodad's name

const body = { name: 'different-name' };
store.dispatch(actionCreators.updateDoodad({ id: '123' }, { body }));

// While the request is out, the current name value remains

doodad = selectors.getDoodad(store.getState(), { id: '123' });
console.log(doodad.value.name, doodad.isUpdating); // some-name, true

// When the response returns, name value will be updated

doodad = selectors.getDoodad(store.getState(), { id: '123' });
console.log(doodad.value.name, doodad.isUpdating); // different-name, false
```

While a selector for the endpoint is available, it will retrieve the same data 
from state as the resourceAlias endpoint selector.

```js
import doodadApi from './doodad-api';
import store from './store';

const { getDoodad, updateDoodad } = doodadApi.selectors;
const params = { id: '123' };
const state = store.getState();

console.log( getDoodad(state, params) === updateDoodad(state, params)); // true
```


## `dataTransform`

Sometimes, the data from your API response is not formatted in such a way that
is suited to your app. In this case, you can use [dataTransform] to shape it to
your app's needs with a [transform function][TransformFn].

```diff
const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id'
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads',
+     dataTranform: (data) => fixup(data)
  },
```
 
In the same vein, [errorTransform] is available to fix up the data from an 
error response.
 

## `repeatRequestDelay`

To avoid writing code to manage if an action needs to make a new request, or if
if a request is already pending, Reduxful handles this for you.

By default, repeated requests are throttled at 3 seconds (3000 ms) between
requests. This can be adjusted by setting the [repeatRequestDelay] to a 
different duration in milliseconds.

```js
const apiDesc = {
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id',
    repeatRequestDelay: 5 * 60 * 1000  // limit repeat requests to 5 minutes 
  },
  getDoodadList: {
    url: 'http://api.my-service.com/doodads',
    repeatRequestDelay: 5000  // limit repeat requests to 5 seconds
  }
};
```


### Throttling

When you have a response, and your app happens to execute another actionCreator, 
Reduxful will recognize this and not issue a new request. A resolved response
will be returned with the previously dispatched action.
 
```js
const isEqual = require('lodash.isequal');

const { getDoodadList } = doodadApi.actionCreators;

const promiseA = store.dispatch(getDoodadList());

// After a response...

const promiseB = store.dispatch(getDoodadList());

promiseB.then(bAction => {
  promiseA.then(aAction => {
    console.log(isEqual(aAction, bAction)); // true
  });
});
```


### Debouncing

When you have a request in flight, and your app happens to dispatch a second
action, Reduxful will recognize this and return the promise from the first
dispatch and not issue a new request.

```js
const { getDoodadList } = doodadApi.actionCreators;

const promiseA = store.dispatch(getDoodadList());

const promiseB = store.dispatch(getDoodadList());

console.log(promiseA === promiseB);  // true
```


## `options`

To pass additional request options along to Fetch or your request library
of choice, you can do so by setting the [options object] in either:

1. [ApiDescription]
2. [RequestDescription]
3. [actionCreator params][ActionCreatorFn]

Duplicate options will be resolved in that order.

Alternatively, [options can be a function][OptionsFn] which receives the
store's `getState` function and a context, and which should return an
options object.

```js
const apiDesc = {
  getDoodadList: {
    url: 'http://api.my-service.com/doodads',
    options: {
      headers: {
        'X-Extra-Data': 'some fixed value'
      }
    }
  },
  getDoodad: {
    url: 'http://api.my-service.com/doodads/:id',
    options: (getState, { params }) => {
      const { id } = params;
      return {
        headers: {
          'X-ID': id,
          'X-Extra-Data': getState().some.dynamic.value
        }
      };
    }
  }
};

const apiConfig = {
  requestAdapter,
  options: {
    credentials: 'include'
  }
};

const doodadApi = setupApi('doodadApi', apiDesc, apiConfig);
```

## From here

Continue learning about [advanced actionCreators] using Reduxful.


<!-- Links -->
[usage docs]:../README.md#Usage
[Advanced actionCreators]:advanced-action-creators.md
[Action]:api.md#Action
[Actions]:api.md#Action
[ApiDescription]:api.md#ApiDescription
[RequestDescription]:api.md#RequestDescription
[method]:api.md#RequestDescription
[resourceAlias]:api.md#RequestDescription
[repeatRequestDelay]:api.md#RequestDescription
[dataTransform]:api.md#RequestDescription
[errorTransform]:api.md#RequestDescription
[options]:api.md#RequestDescription
[ActionCreatorFn]:api.md#ActionCreatorFn
[TransformFn]:api.md#TransformFn
[OptionsFn]:api.md#OptionsFn
