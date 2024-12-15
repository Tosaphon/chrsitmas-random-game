import { defineFunction } from '@aws-amplify/backend';

export const batchInsertNumbers = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'batch-insert-numbers',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});
