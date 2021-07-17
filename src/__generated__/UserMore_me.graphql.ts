/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuthType = "apple" | "email" | "facebook" | "google";
export type UserMore_me = {
    readonly statusMessage: string | null;
    readonly verified: boolean | null;
    readonly photoURL: string | null;
    readonly thumbURL: string | null;
    readonly profile: {
        readonly authType: AuthType | null;
    } | null;
    readonly " $refType": "UserMore_me";
};
export type UserMore_me$data = UserMore_me;
export type UserMore_me$key = {
    readonly " $data"?: UserMore_me$data;
    readonly " $fragmentRefs": FragmentRefs<"UserMore_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserMore_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "statusMessage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verified",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "photoURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "thumbURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "authType",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
(node as any).hash = 'a6fb25d5d3c24c478de611da7cc160de';
export default node;
