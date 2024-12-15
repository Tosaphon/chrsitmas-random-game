// import type { Schema } from "../../data/resource";

// export const handler: Schema["batchInsertNumbers"]["functionHandler"] = async (event) => {
//     const { numbers } = event.arguments;

//     for (const number of numbers) {
//         if (!database.numbers.includes(number)) {
//             database.numbers.push(number);
//         }
//     }

//     return true;
// };