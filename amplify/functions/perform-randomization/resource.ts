import { defineFunction } from '@aws-amplify/backend';

export const performRandomization = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'perform-randomization',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});