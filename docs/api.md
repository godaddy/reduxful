## Classes

<dl>
<dt><a href="#Reduxful">Reduxful</a></dt>
<dd><p>Main class which manages RESTful requests and state with Redux.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeFetchAdapter">makeFetchAdapter(fetcher, [defaultOptions])</a> ⇒ <code>function</code></dt>
<dd><p>Make an adapter to match the RequestAdapter interface using Fetch</p>
</dd>
<dt><a href="#setupApi">setupApi(apiName, apiDesc, [config])</a> ⇒ <code><a href="#Reduxful">Reduxful</a></code></dt>
<dd><p>Create new RESTful configuration for Redux.</p>
</dd>
<dt><a href="#setRequestAdapter">setRequestAdapter(requestAdapter)</a></dt>
<dd><p>Register an ajax request adapter.</p>
</dd>
<dt><a href="#getResourceKey">getResourceKey(reqName, params)</a> ⇒ <code>string</code></dt>
<dd><p>Builds the resource key based on the parameters passed.</p>
</dd>
<dt><a href="#isLoaded">isLoaded(resource)</a> ⇒ <code>boolean</code></dt>
<dd><p>Helper function to check if a Resource has been loaded.</p>
</dd>
<dt><a href="#isUpdating">isUpdating(resource)</a> ⇒ <code>boolean</code></dt>
<dd><p>Helper function to check of a Resource is being updated.</p>
</dd>
<dt><a href="#hasError">hasError(resource)</a> ⇒ <code>boolean</code></dt>
<dd><p>Helper function to check if a Resource has an error.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ActionCreatorFn">ActionCreatorFn</a> ⇒ <code><a href="#ActionCreatorThunkFn">ActionCreatorThunkFn</a></code></dt>
<dd><p>Action creator which kicks off request and creates lifecycle actions.
The sub-action creators are used during the lifecycle of a request to dispatch
updates to a resource in redux state. They are also exposed should
direct developer access be needed.</p>
</dd>
<dt><a href="#ActionCreatorThunkFn">ActionCreatorThunkFn</a> ⇒ <code><a href="#Action">[ &#x27;Promise&#x27; ].&lt;Action&gt;</a></code></dt>
<dd><p>Thunk will actually dispatch an Action only if:</p>
<ol>
<li>it is not debounced</li>
<li>it is not throttled</li>
</ol>
<p>Thunk will always return a resolving promise with either:</p>
<ol>
<li>new action being dispatched</li>
<li>same action being dispatched if debounced</li>
<li>previous action dispatched if throttled</li>
</ol>
</dd>
<dt><a href="#RequestAdapter">RequestAdapter</a> ⇒ <code>Promise</code></dt>
<dd><p>RequestAdapter structure</p>
</dd>
<dt><a href="#RequestAdapterOptions">RequestAdapterOptions</a> : <code>object</code></dt>
<dd><p>RequestAdapter Options</p>
</dd>
<dt><a href="#Resource">Resource</a> : <code>object</code></dt>
<dd><p>Resource object</p>
</dd>
<dt><a href="#RequestDescription">RequestDescription</a> : <code>object</code></dt>
<dd><p>Request Description object</p>
</dd>
<dt><a href="#ApiDescription">ApiDescription</a> : <code>object</code></dt>
<dd><p>Api Description object</p>
</dd>
<dt><a href="#ApiConfig">ApiConfig</a> : <code>object</code></dt>
<dd><p>Api Config object</p>
</dd>
<dt><a href="#Action">Action</a> : <code>object</code></dt>
<dd><p><a href="https://github.com/redux-utilities/flux-standard-action">Flux Standard Action</a> compliant action.</p>
</dd>
<dt><a href="#OptionsFn">OptionsFn</a> ⇒ <code>object</code></dt>
<dd><p>Function to create request options object which can read from Redux state</p>
</dd>
<dt><a href="#UrlTemplateFn">UrlTemplateFn</a> ⇒ <code>string</code></dt>
<dd><p>Function to create url template string which can read from Redux state.
Placeholders can be set, with final URL built by <a href="https://github.com/godaddy/transform-url#readme">transform-url</a>.</p>
</dd>
<dt><a href="#SubActionCreatorFn">SubActionCreatorFn</a> ⇒ <code>object</code></dt>
<dd><p>Sub action creator function</p>
</dd>
<dt><a href="#SelectorFn">SelectorFn</a> ⇒ <code><a href="#Resource">Resource</a></code></dt>
<dd><p>Selector function to retrieve a resource from Redux state</p>
</dd>
<dt><a href="#ReducerFn">ReducerFn</a> ⇒ <code>object</code></dt>
<dd><p>Redux Reducer function</p>
</dd>
<dt><a href="#TransformFn">TransformFn</a> ⇒ <code>*</code></dt>
<dd><p>Transform function</p>
</dd>
</dl>

<a name="Reduxful"></a>

## Reduxful
Main class which manages RESTful requests and state with Redux.

**Kind**: global class  
**Access**: public  

* [Reduxful](#Reduxful)
    * [new Reduxful(apiName, apiDesc, [apiConfig])](#new_Reduxful_new)
    * [.actionCreators](#Reduxful+actionCreators) ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code>
    * [.actions](#Reduxful+actions) ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code>
    * [.reducers](#Reduxful+reducers) ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code>
    * [.reducerMap](#Reduxful+reducerMap) ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code>
    * [.selectors](#Reduxful+selectors) ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, SelectorFn&gt;</code>

<a name="new_Reduxful_new"></a>

### new Reduxful(apiName, apiDesc, [apiConfig])
Create new RESTful configuration for Redux.


| Param | Type | Description |
| --- | --- | --- |
| apiName | <code>string</code> | Name of the REST API |
| apiDesc | [<code>ApiDescription</code>](#ApiDescription) | Description object of target REST API |
| [apiConfig] | [<code>ApiConfig</code>](#ApiConfig) | Optional configuration settings |
| [apiConfig.requestAdapter] | [<code>RequestAdapter</code>](#RequestAdapter) | Request adapter to use |
| [apiConfig.options] | <code>object</code> \| [<code>OptionsFn</code>](#OptionsFn) | Options to be passed to the request adapter |

<a name="Reduxful+actionCreators"></a>

### reduxful.actionCreators ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code>
Property

**Kind**: instance property of [<code>Reduxful</code>](#Reduxful)  
**Returns**: <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code> - redux action creators  
<a name="Reduxful+actions"></a>

### reduxful.actions ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code>
Alias to actionCreators

**Kind**: instance property of [<code>Reduxful</code>](#Reduxful)  
**Returns**: <code>[ &#x27;Object&#x27; ].&lt;string, ActionCreatorFn&gt;</code> - redux action creators  
<a name="Reduxful+reducers"></a>

### reduxful.reducers ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code>
Property

**Kind**: instance property of [<code>Reduxful</code>](#Reduxful)  
**Returns**: <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code> - redux reducers  
<a name="Reduxful+reducerMap"></a>

### reduxful.reducerMap ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code>
Alias to reducers

**Kind**: instance property of [<code>Reduxful</code>](#Reduxful)  
**Returns**: <code>[ &#x27;Object&#x27; ].&lt;string, ReducerFn&gt;</code> - redux reducers  
<a name="Reduxful+selectors"></a>

### reduxful.selectors ⇒ <code>[ &#x27;Object&#x27; ].&lt;string, SelectorFn&gt;</code>
Property

**Kind**: instance property of [<code>Reduxful</code>](#Reduxful)  
**Returns**: <code>[ &#x27;Object&#x27; ].&lt;string, SelectorFn&gt;</code> - redux selectors  
<a name="makeFetchAdapter"></a>

## makeFetchAdapter(fetcher, [defaultOptions]) ⇒ <code>function</code>
Make an adapter to match the RequestAdapter interface using Fetch

**Kind**: global function  
**Returns**: <code>function</code> - fetchAdapter  

| Param | Type | Description |
| --- | --- | --- |
| fetcher | <code>function</code> | Fetch API or ponyfill |
| [defaultOptions] | <code>object</code> | Any default request options |

<a name="setupApi"></a>

## setupApi(apiName, apiDesc, [config]) ⇒ [<code>Reduxful</code>](#Reduxful)
Create new RESTful configuration for Redux.

**Kind**: global function  
**Returns**: [<code>Reduxful</code>](#Reduxful) - instance  

| Param | Type | Description |
| --- | --- | --- |
| apiName | <code>string</code> | Name of the REST API |
| apiDesc | [<code>ApiDescription</code>](#ApiDescription) | Description object of target REST API |
| [config] | [<code>ApiConfig</code>](#ApiConfig) | Optional configuration settings |
| [config.requestAdapter] | [<code>RequestAdapter</code>](#RequestAdapter) | Request adapter to use |
| [config.options] | <code>object</code> \| [<code>OptionsFn</code>](#OptionsFn) | Options to be passed to the request adapter |

<a name="setRequestAdapter"></a>

## setRequestAdapter(requestAdapter)
Register an ajax request adapter.

**Kind**: global function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| requestAdapter | [<code>RequestAdapter</code>](#RequestAdapter) | Request adapter to use |

<a name="getResourceKey"></a>

## getResourceKey(reqName, params) ⇒ <code>string</code>
Builds the resource key based on the parameters passed.

**Kind**: global function  
**Returns**: <code>string</code> - resource key  

| Param | Type | Description |
| --- | --- | --- |
| reqName | <code>string</code> | Name of the API request. |
| params | <code>[ &#x27;Object&#x27; ].&lt;string, (string\|number)&gt;</code> | Parameters used as URL or Query params |

<a name="isLoaded"></a>

## isLoaded(resource) ⇒ <code>boolean</code>
Helper function to check if a Resource has been loaded.

**Kind**: global function  
**Returns**: <code>boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | Resource object |

<a name="isUpdating"></a>

## isUpdating(resource) ⇒ <code>boolean</code>
Helper function to check of a Resource is being updated.

**Kind**: global function  
**Returns**: <code>boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | Resource object |

<a name="hasError"></a>

## hasError(resource) ⇒ <code>boolean</code>
Helper function to check if a Resource has an error.

**Kind**: global function  
**Returns**: <code>boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | Resource object |

<a name="ActionCreatorFn"></a>

## ActionCreatorFn ⇒ [<code>ActionCreatorThunkFn</code>](#ActionCreatorThunkFn)
Action creator which kicks off request and creates lifecycle actions.
The sub-action creators are used during the lifecycle of a request to dispatch
updates to a resource in redux state. They are also exposed should
direct developer access be needed.

**Kind**: global typedef  
**Returns**: [<code>ActionCreatorThunkFn</code>](#ActionCreatorThunkFn) - thunk  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | Params applied to the url path or query |
| [options] | <code>object</code> \| [<code>OptionsFn</code>](#OptionsFn) | Options to be passed to the request adapter |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| reset | [<code>SubActionCreatorFn</code>](#SubActionCreatorFn) | Reset resource to baseline |
| start | [<code>SubActionCreatorFn</code>](#SubActionCreatorFn) | Set resource to isUpdate |
| success | [<code>SubActionCreatorFn</code>](#SubActionCreatorFn) | Update resource to be loaded with value from a response |
| fail | [<code>SubActionCreatorFn</code>](#SubActionCreatorFn) | Update resource with error as returned from a response |

<a name="ActionCreatorThunkFn"></a>

## ActionCreatorThunkFn ⇒ [<code>[ &#x27;Promise&#x27; ].&lt;Action&gt;</code>](#Action)
Thunk will actually dispatch an Action only if:
  1. it is not debounced
  2. it is not throttled

Thunk will always return a resolving promise with either:
  1. new action being dispatched
  2. same action being dispatched if debounced
  3. previous action dispatched if throttled

**Kind**: global typedef  
**Returns**: [<code>[ &#x27;Promise&#x27; ].&lt;Action&gt;</code>](#Action) - promise  

| Param | Type | Description |
| --- | --- | --- |
| dispatch | <code>function</code> | Redux store dispatcher |
| getState | <code>function</code> | Get redux store state |

<a name="RequestAdapter"></a>

## RequestAdapter ⇒ <code>Promise</code>
RequestAdapter structure

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| options | [<code>RequestAdapterOptions</code>](#RequestAdapterOptions) | 

<a name="RequestAdapterOptions"></a>

## RequestAdapterOptions : <code>object</code>
RequestAdapter Options

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.method | <code>string</code> | HTTP method to use (GET, POST, etc.) |
| options.url | <code>string</code> | URL to call |
| options.headers | <code>[ &#x27;Object&#x27; ].&lt;string, string&gt;</code> | Header for request |
| options.withCredentials | <code>boolean</code> | Should cookies be passed for cross-origin requests |
| options.body | <code>\*</code> | Optional body of request |

<a name="Resource"></a>

## Resource : <code>object</code>
Resource object

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | <code>object</code> \| <code>Array</code> \| <code>\*</code> | Body of the api response |
| error | <code>object</code> \| <code>Array</code> \| <code>\*</code> | Body of the api error response |
| hasError | <code>boolean</code> | True if api response returned as an error |
| isLoaded | <code>boolean</code> | True if api response returned as success |
| isUpdating | <code>boolean</code> | True if a request is pending |
| requestTime | <code>number</code> \| <code>null</code> | Timestamp when new request started |
| responseTime | <code>number</code> \| <code>null</code> | Timestamp when response received |

<a name="RequestDescription"></a>

## RequestDescription : <code>object</code>
Request Description object

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| url | <code>string</code> \| [<code>UrlTemplateFn</code>](#UrlTemplateFn) | URL template of the REST endpoint. Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme). |
| [method] | <code>string</code> | HTTP method to use |
| [resourceAlias] | <code>string</code> | Resource name alias |
| [resourceData] | <code>object</code> \| <code>Array</code> \| <code>\*</code> | Optional initial resource data |
| [dataTransform] | [<code>TransformFn</code>](#TransformFn) | Function to fixup request response |
| [errorTransform] | [<code>TransformFn</code>](#TransformFn) | Function to fixup request error response |
| [repeatRequestDelay] | <code>number</code> | Required delay time in milliseconds between repeated requests |
| [options] | <code>object</code> \| [<code>OptionsFn</code>](#OptionsFn) | Options to be passed to the request adapter |

<a name="ApiDescription"></a>

## ApiDescription : <code>object</code>
Api Description object

**Kind**: global typedef  
<a name="ApiConfig"></a>

## ApiConfig : <code>object</code>
Api Config object

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [requestAdapter] | [<code>RequestAdapter</code>](#RequestAdapter) | Adapter for request library |
| [options] | <code>object</code> \| [<code>OptionsFn</code>](#OptionsFn) | Options to be passed to the request adapter |

<a name="Action"></a>

## Action : <code>object</code>
[Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) compliant action.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of action in the format `<ApiName>_<requestName>_<result>` |
| payload | <code>string</code> | Transformed resource value or error; body of response. |
| meta | <code>object</code> | Action metadata |
| meta.key | <code>string</code> | Key of the particular resource |
| [error] | <code>boolean</code> | Whether the action is an error |

<a name="OptionsFn"></a>

## OptionsFn ⇒ <code>object</code>
Function to create request options object which can read from Redux state

**Kind**: global typedef  
**Returns**: <code>object</code> - options  

| Param | Type | Description |
| --- | --- | --- |
| getState | <code>function</code> | Gets the current redux state |

<a name="UrlTemplateFn"></a>

## UrlTemplateFn ⇒ <code>string</code>
Function to create url template string which can read from Redux state.
Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme).

**Kind**: global typedef  
**Returns**: <code>string</code> - urlTemplate  

| Param | Type | Description |
| --- | --- | --- |
| getState | <code>function</code> | Gets the current redux state |

<a name="SubActionCreatorFn"></a>

## SubActionCreatorFn ⇒ <code>object</code>
Sub action creator function

**Kind**: global typedef  
**Returns**: <code>object</code> - action  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | Params applied to the url path or query |
| payload | <code>object</code> | Transformed resource value or error; body of response. |

<a name="SelectorFn"></a>

## SelectorFn ⇒ [<code>Resource</code>](#Resource)
Selector function to retrieve a resource from Redux state

**Kind**: global typedef  
**Returns**: [<code>Resource</code>](#Resource) - resource  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | Redux state to select resource from |
| params | <code>object</code> | Params used to key a particular resource request |

<a name="ReducerFn"></a>

## ReducerFn ⇒ <code>object</code>
Redux Reducer function

**Kind**: global typedef  
**Returns**: <code>object</code> - newState  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | State |
| action | <code>object</code> | Action |

<a name="TransformFn"></a>

## TransformFn ⇒ <code>\*</code>
Transform function

**Kind**: global typedef  
**Returns**: <code>\*</code> - data  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> \| <code>Array</code> \| <code>\*</code> | Body of the api response |
| [context] | <code>object</code> | Context |
| [context.params] | <code>object</code> | Params from action for request |

