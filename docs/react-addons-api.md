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
| value | <code>Object</code> \| <code>Array</code> \| <code>String</code> \| <code>\*</code> | 
| error | <code>Object</code> \| <code>Array</code> \| <code>String</code> \| <code>\*</code> | 
| hasError | <code>Boolean</code> | 
| isLoaded | <code>Boolean</code> | 
| isUpdating | <code>Boolean</code> | 
| requestTime | <code>Number</code> | 
| responseTime | <code>Number</code> | 

<a name="extendResourceShape"></a>

## extendResourceShape(propTypes) ⇒ <code>shape</code>
Use to extend the `resourceShape` to define `value` and/or `error` structures.

**Kind**: global function  
**Returns**: <code>shape</code> - shape  

| Param | Type | Description |
| --- | --- | --- |
| propTypes | <code>Object</code> | PropTypes to override resource shapes |
| [propTypes.value] | <code>Object</code> | Shape of expected value |
| [propTypes.error] | <code>Object</code> | Shape of expected error |

