import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
// import { batchInsertNumbers } from './functions/batch-insert-numbers/resource'
// import { checkAndSaveNumber } from './functions/check-and-save-number/resource'
// import { fetchRandomStatus } from './functions/fetch-random-status/resource'

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),

  NumberEntry: a
    .model({
      number: a.integer().required(),
    })
    .authorization((allow) => [allow.guest()]),

  RandomStatus: a
    .model({
      status: a.boolean().required(),
      randomNumbers: a.integer().array()
        .authorization((allow) => [allow.guest()]),
    }),

  // checkAndSaveNumber: a.mutation()
  //   .arguments({
  //     number: a.integer().required(),
  //   })
  //   .returns(
  //     a.model({
  //       success: a.boolean().required(),
  //       error: a.string(),
  //     })
  //   )
  //   .handler(a.handler.function(checkAndSaveNumber)),
  // fetchRandomStatus: a.query()
  //   .returns(
  //     a.model({
  //       status: a.string().required(),
  //       randomNumbers: a.integer().array(),
  //     })
  //   )
  //   .handler(a.handler.function(fetchRandomStatus)),

  // batchInsertNumbers: a.query()
  //   .handler(a.handler.function(batchInsertNumbers)),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
