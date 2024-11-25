import { createDB } from "./modules/database/create-db.js";
import { createServer } from "./modules/api.js";

(async () =>{
  
  await createDB();
  await createServer();

})()