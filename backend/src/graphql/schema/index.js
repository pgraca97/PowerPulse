// src/graphql/schema/index.js
import { userTypes } from './types/user.js';
import { userQueries } from './queries/user.js';
import { userMutations } from './mutations/user.js';

export const typeDefs = `
  ${userTypes}
  ${userQueries}
  ${userMutations}
`;