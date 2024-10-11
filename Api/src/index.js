import { createDB } from "./modules/database/create-db.js";
import { createServer } from "./modules/api.js";

createDB();
createServer();