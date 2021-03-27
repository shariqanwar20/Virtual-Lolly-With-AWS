/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLollies = /* GraphQL */ `
  query GetLollies {
    getLollies {
      id
      sender
      reciever
      message
      lollyTop
      lollyMiddle
      lollyBottom
    }
  }
`;
export const getLollyById = /* GraphQL */ `
  query GetLollyById($id: ID!) {
    getLollyById(id: $id) {
      id
      sender
      reciever
      message
      lollyTop
      lollyMiddle
      lollyBottom
    }
  }
`;
