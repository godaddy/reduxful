declare module 'reduxful' {
  // fetchUtils
  export interface RequestAdapterOptions {
    method: string;
    url: string;
    headers: Map<string, string>;
    withCredentials: boolean;
    body: any;
  }

  export type RequestAdapter = (options: RequestAdapterOptions) => Promise<any>;

  export type Fetcher = (url: string, outOpts: Object) => Promise<any>;

  export function makeFetchAdapter(
    fetcher: Fetcher,
    defaultOptions?: Object
  ): RequestAdapter;

  // utils
  export interface Resource {
    isLoaded?: boolean;
    isUpdating?: boolean;
    hasError?: boolean;
  }

  export function isLoaded(resource?: Resource): boolean;

  export function isUpdating(resource?: Resource): boolean;

  export function hasError(resource?: Resource): boolean;

  export function getResourceKey(
    reqName: string,
    params?: { [key: string]: string | number }
  ): string;

  // reduxful
  export type ApiDescription = Object;

  export type OptionsFn = (getState: () => any) => Object;

  export interface ApiConfig {
    requestAdapter?: RequestAdapter;
    options?: OptionsFn;
  }

  export interface Action {
    type: string;
    payload: string;
    meta: { key: string };
    error?: boolean;
  }

  export type ActionCreatorThunkFn = (
    dispatch: () => any,
    getState: () => any
  ) => Promise<Action>;

  export type ActionCreatorFn = (
    params: Object,
    options?: OptionsFn
  ) => ActionCreatorThunkFn;

  export type ReducerFn = (state: Object, action: Object) => Object;

  export type SelectorFn = (state: Object, params: Object) => Resource;

  export interface ReduxfulProps {
    actionCreators: Map<string, ActionCreatorFn>;
    actions: Map<string, ActionCreatorFn>;
    reducers: Map<string, ReducerFn>;
    reducerMap: Map<string, ReducerFn>;
    selectors: Map<string, SelectorFn>;
  }

  class Reduxful implements ReduxfulProps {
    public actionCreators: Map<string, ActionCreatorFn>;
    public actions: Map<string, ActionCreatorFn>;
    public reducers: Map<string, ReducerFn>;
    public reducerMap: Map<string, ReducerFn>;
    public selectors: Map<string, SelectorFn>;
    constructor(apiName: string, apiDesc: ApiDescription, apiConfig?: ApiConfig);
  }

  export function setupApi(
    apiName: string,
    apiDesc: ApiDescription,
    config?: Object
  ): Reduxful;

  export default Reduxful;
}
