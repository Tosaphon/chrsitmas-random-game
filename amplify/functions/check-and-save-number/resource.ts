import { defineFunction } from '@aws-amplify/backend';

export const checkAndSaveNumber = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'check-and-save-number',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});
