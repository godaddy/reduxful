# Using with React

Using [react-redux] to bind your React components to actionCreators and
selectors is pretty straight-forward. We'll walk through some example of
how to do so in this guide.

Also checkout out the [React addons docs][react-addons]
for React propType validation tools.

## Connect resource selectors

These examples continue where we left off with the  `doodadApi`
from the [usage docs].

To start with we will have a component that displays the details of a Doodad.
The component has a `doodadId` prop, by which the Doodad to lookup is
determined. i.e. `<DoodadView doodadId='123' />`.

```jsx harmony
// doodad-view.js

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isLoaded } from 'reduxful';
import doodadApi from './doodad-api';

export class DoodadView extends React.Component {

  render() {
    const { doodadId, doodad } = this.props;

    if (!doodadId) {
      return 'Select a doodad';
    }

    if (!isLoaded(doodad)) {
      return 'Loading details...';
    }

    //
    // Destructure attributes of the resource value to render.
    // These are particular to our hypothetical Doodad data and will
    // be different for whatever data your app will be consuming.
    const { id, details } = doodad.value;

    return (
      <div>
        ID: {id}
        Details: {details}
      </div>
    );
  }
}

DoodadView.propTypes = {
  doodadId: PropTypes.string,
  // injected
  doodad: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { doodadId } = ownProps;
  return {
    doodad: doodadApi.selectors.getDoodad(state, { id: doodadId })
  };
};
export default connect(mapStateToProps)(DoodadView);
```

We are using `connect` to get access to the Redux state, and using our selector
for grabbing the correct doodad resource from state, passing the param (id) 
by which the resource is keyed.

The DoodadView component assumes that a request for the doodad specified has
already been made, and all the component has to do is watch redux state for the
resource to be updated with a response. However, we could make the component
also dispatch the action to initiate the request.

## Connect actionCreator dispatchers

Using the `mapDispatchToProps` argument with `connect`, we can easily make
our actionCreators available to the component.
Because `doodadApi.actionsCreators` is an object, we could just pass it as
the second argument. However, that would result in spreading all the
actionsCreators from our API description. So instead, we will pick out only the
particular one we need.

```jsx harmony
export default connect(
  mapStateToProps,
  { getDoodad: doodadApi.actionCreators.getDoodad }
)(DoodadView);
```

And don't forget to update the components propTypes:

```diff
DoodadView.propTypes = {
  doodadId: PropTypes.string,
  // injected
+   getDoodad: PropTypes.func,
  doodad: PropTypes.object
};
```

Now that we are injecting our actionCreator mapped to dispatch into the
component, all we have to do now is tell the component when to execute it.
We will want to dispatch an action when the component mounts, but also if the
`doodadId` passed to our component changes. To do this, we will need to tie
into two React component lifecycles.

```jsx harmony
  componentDidMount() {
    const { getDoodad, doodadId } = this.props;
    getDoodad({id: doodadId});
  }
  
  componentDidUpdate(prevProps) {
    const { getDoodad, doodadId } = this.props;
    if (doodadId !== prevProps.doodadId) {
      getDoodad({id: doodadId});
    }
  }
```

Now our component will dispatch the action to make our API request. Even if the
action was dispatched outside of the component, Reduxful will automatically
debounce requests in flight, and throttle repeat requests so as not to spam the
network with unnecessary or unwanted requests.

## Specify PropTypes

Currently, we are getting away with setting our doodad resource to a simple
object propType. There are a couple things we could do to make this component
contract more explicit.

As a first option, we could simply set the doodad propType to `resourceShape`
from the [react-addons].

```diff
+ import { resourceShape } from 'reduxful/react-addons';

DoodadView.propTypes = {
  doodadId: PropTypes.string,
  // injected
  getDoodad: PropTypes.func,
-  doodad: PropTypes.object
+  doodad: resourceShape
};
```

As a more refined option, we could use `extendResourceShape` to detailed
`value` and `error` shapes for our expected resource. In this example, our
resource value _is required_ to have an `id`, however `details` are optional.

```jsx harmony
import { extendResourceShape } from 'reduxful/react-addons';

const doodadShape = extendResourceShape({
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    details: PropTypes.object
  }),
  error: PropTypes.string
});
```

```diff
DoodadView.propTypes = {
  doodadId: PropTypes.string,
  // injected
  getDoodad: PropTypes.func,
-  doodad: resourceShape
+  doodad: doodadShape
};
``` 

## From here

Be sure to check out the [react-redux docs] for more details on using connect
and for setting up the store provider.


<!-- Links -->
[usage docs]:../README.md#usage
[react-addons]:react-addons-api.md

<!-- External Links -->
[react-redux]:https://github.com/reduxjs/react-redux
[react-redux docs]:https://github.com/reduxjs/react-redux/blob/master/docs/api.md
