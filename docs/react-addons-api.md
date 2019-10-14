## Constants

<dl>
<dt><a href="#resourceShape">resourceShape</a></dt>
<dd><p>Base propTypes shape used for validation of resources in React components.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#extendResourceShape">extendResourceShape(propTypes)</a> ⇒ <code>shape</code></dt>
<dd><p>Use to extend the <code>resourceShape</code> to define <code>value</code> and/or <code>error</code> structures.</p>
</dd>
</dl>

<a name="resourceShape"></a>

## resourceShape
Base propTypes shape used for validation of resources in React components.

**Kind**: global constant  
**Properties**

| Name | Type |
| --- | --- |
| value | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>\*</code> | 
| error | <code>object</code> \| <code>Array</code> \| <code>string</code> \| <code>\*</code> | 
| hasError | <code>boolean</code> | 
| isLoaded | <code>boolean</code> | 
| isUpdating | <code>boolean</code> | 
| requestTime | <code>number</code> | 
| responseTime | <code>number</code> | 

<a name="extendResourceShape"></a>

## extendResourceShape(propTypes) ⇒ <code>shape</code>
Use to extend the `resourceShape` to define `value` and/or `error` structures.

**Kind**: global function  
**Returns**: <code>shape</code> - shape  

| Param | Type | Description |
| --- | --- | --- |
| propTypes | <code>object</code> | PropTypes to override resource shapes |
| [propTypes.value] | <code>object</code> | Shape of expected value |
| [propTypes.error] | <code>object</code> | Shape of expected error |

