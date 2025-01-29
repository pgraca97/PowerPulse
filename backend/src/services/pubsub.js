// backend/src/services/pubsub.js
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const EVENTS = {
    EXERCISE_CREATED: 'EXERCISE_CREATED'
};