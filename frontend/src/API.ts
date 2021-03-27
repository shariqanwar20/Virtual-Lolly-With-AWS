/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AddLolly = {
  sender: string,
  reciever: string,
  message: string,
  lollyTop: string,
  lollyMiddle: string,
  lollyBottom: string,
};

export type Lolly = {
  __typename: "Lolly",
  id?: string,
  sender?: string,
  reciever?: string,
  message?: string,
  lollyTop?: string,
  lollyMiddle?: string,
  lollyBottom?: string,
};

export type AddLollyMutationVariables = {
  lolly?: AddLolly,
};

export type AddLollyMutation = {
  addLolly?:  {
    __typename: "Lolly",
    id: string,
    sender: string,
    reciever: string,
    message: string,
    lollyTop: string,
    lollyMiddle: string,
    lollyBottom: string,
  } | null,
};

export type GetLolliesQuery = {
  getLollies?:  Array< {
    __typename: "Lolly",
    id: string,
    sender: string,
    reciever: string,
    message: string,
    lollyTop: string,
    lollyMiddle: string,
    lollyBottom: string,
  } | null > | null,
};
