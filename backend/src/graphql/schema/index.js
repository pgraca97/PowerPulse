
import { userTypes } from "./types/user.js";
import { userQueries } from "./queries/user.js";
import { userMutations } from "./mutations/user.js";

import { exerciseTypes } from "./types/exercise.js";
import { exerciseQueries } from "./queries/exercise.js";
import { exerciseMutations } from "./mutations/exercise.js";
import { exerciseSubscriptions } from "./subscriptions/exercise.js";

import { exerciseTypeTypes } from "./types/exerciseType.js";
import { exerciseTypeQueries } from "./queries/exerciseType.js";
import { exerciseTypeMutations } from "./mutations/exerciseType.js";

import { notificationTypes } from "./types/notification.js";
import { notificationQueries } from "./queries/notification.js";
import { notificationMutations } from "./mutations/notification.js";

export const typeDefs = `
  ${userTypes}
  ${userQueries}
  ${userMutations}
  ${exerciseTypes}
  ${exerciseQueries}
  ${exerciseMutations}
  ${exerciseSubscriptions}
  ${exerciseTypeTypes}
  ${exerciseTypeQueries}
  ${exerciseTypeMutations}
  ${notificationTypes}
  ${notificationQueries}
  ${notificationMutations}
`;
