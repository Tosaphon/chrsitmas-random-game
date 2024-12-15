// import type { Schema } from "../../data/resource";
// import { generateClient } from 'aws-amplify/data'
// const client = generateClient<Schema>()

// export const handler: Schema["checkAndSaveNumber"]["functionHandler"] = async (event) => {
//     const { number } = event.arguments;
//     const items = await client.models.NumberEntry.list();
    
//     // const existingNumber = items.find((item) => item.number === number);
//     // if (existingNumber) {
//     //     return { success: false, error: "Number already exists" };
//     // }

//     await client.models.NumberEntry.create({ number });
//     return { success: true, error: null };
// };