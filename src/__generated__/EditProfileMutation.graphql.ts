/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type EditProfileMutationVariables = {
    name: string;
};
export type EditProfileMutationResponse = {
    readonly updateProfile: {
        readonly id: string;
        readonly name: string | null;
    } | null;
};
export type EditProfileMutation = {
    readonly response: EditProfileMutationResponse;
    readonly variables: EditProfileMutationVariables;
};



/*
mutation EditProfileMutation(
  $name: String!
) {
  updateProfile(user: {name: $name}) {
    id
    name
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "name",
            "variableName": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "user"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "updateProfile",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditProfileMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditProfileMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8b70837c60c5be33aee6d9c0977cd688",
    "id": null,
    "metadata": {},
    "name": "EditProfileMutation",
    "operationKind": "mutation",
    "text": "mutation EditProfileMutation(\n  $name: String!\n) {\n  updateProfile(user: {name: $name}) {\n    id\n    name\n  }\n}\n"
  }
};
})();
(node as any).hash = '3bb53cf3405428e8a905977e2683a73c';
export default node;
