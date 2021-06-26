declare module 'reduxful' {
  // fetchUtils
  export interface RequestAdapterOptions {
    method: string;
    url: string;
    headers: { [key: string]: string };
    withCredentials: boolean;
    body: any;
  }

  export type RequestAdapter = (options: RequestAdapterOptions) => Promise<any>;

  export function makeFetchAdapter(
    fetcher: typeof fetch,
    defaultOptions?: Object
  ): RequestAdapter;

  // utils
  export interface Resource<ValueType = any> {
    isLoaded?: boolean;
    isUpdating?: boolean;
    hasError?: boolean;
    value?: ValueType;
  }

  export function isLoaded(resource?: Resource): boolean;

  export function isUpdating(resource?: Resource): boolean;

  export function hasError(resource?: Resource): boolean;

  export function getResourceKey(
    reqName: string,
    params?: { [key: string]: string | number }
  ): string;

  // reduxful
  export type TransformFn = (data: any, context?: { params?: Object, options?: Object }) => any;

  export type UrlTemplateFn = (getState: () => any) => string;

  export type OptionsFn<Options = Object> = (getState: () => any) => Options;

  export interface RequestDescription<Options = Object> {
    url: string | UrlTemplateFn;
    method?: string;
    resourceAlias?: string;
    resourceData?: any;
    dataTransform?: TransformFn;
    errorTransform?: TransformFn;
    repeatRequestDelay?: number;
    options?: Options | OptionsFn<Options>;
  }

  export interface ApiDescription {
    [key: string]: RequestDescription;
  }

  export interface ApiConfig<Options = Object> {
    requestAdapter?: RequestAdapter;
    options?: Options | OptionsFn<Options>;
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

  export type ActionCreatorFn<Options = Object> = (
    params: { [paramName: string]: any },
    options?: Options | OptionsFn<Options>
  ) => ActionCreatorThunkFn;

  export type ReducerFn<S = any> = (state: S, action: Object) => S;

  export type SelectorFn = (state: Object, params: Object) => Resource;

  export interface ReduxfulProps {
    actionCreators: { [key: string]: ActionCreatorFn };
    actions: { [key: string]: ActionCreatorFn };
    reducers: { [key: string]: ReducerFn };
    reducerMap: { [key: string]: ReducerFn };
    selectors: { [key: string]: SelectorFn };
  }

  class Reduxful implements ReduxfulProps {
    public actionCreators: { [key: string]: ActionCreatorFn };
    public actions: { [key: string]: ActionCreatorFn };
    public reducers: { [key: string]: ReducerFn };
    public reducerMap: { [key: string]: ReducerFn };
    public selectors: { [key: string]: SelectorFn };
    constructor(apiName: string, apiDesc: ApiDescription, apiConfig?: ApiConfig);
  }

  export function setupApi(
    apiName: string,
    apiDesc: ApiDescription,
    config?: ApiConfig
  ): Reduxful;

  export default Reduxful;
}
