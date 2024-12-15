import { defineFunction } from '@aws-amplify/backend';

export const fetchRandomStatus = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'fetch-random-status',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});