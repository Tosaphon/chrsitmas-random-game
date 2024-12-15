import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
// import { batchInsertNumbers } from './functions/batch-insert-numbers/resource'
// import { checkAndSaveNumber } from './functions/check-and-save-number/resource'
// import { clearRandomData } from './functions/clear-random-data/resource'
// import { fetchRandomStatus } from './functions/fetch-random-status/resource'
// import { performRandomization } from './functions/perform-randomization/resource'


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  storage,
  // batchInsertNumbers,
  // checkAndSaveNumber,
  // clearRandomData,
  // fetchRandomStatus,
  // performRandomization
});
