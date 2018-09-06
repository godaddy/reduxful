import { getResourceKey } from './utils';


export default function createSelectors(apiName, apiDesc) {
  return Object.keys(apiDesc).reduce((acc, name) => {
    const reqDesc = apiDesc[name];
    const { resourceAlias } = reqDesc;

    acc[name] = function selector(state, params) {
      const key = getResourceKey(resourceAlias || name, params);
      return (state[apiName] || {})[key];
    };

    if (resourceAlias && !acc[resourceAlias]) acc[resourceAlias] = acc[name];

    return acc;
  }, {});
}
