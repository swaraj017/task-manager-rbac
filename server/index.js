import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connection } from "./src/connection/db.js";
import authRoutes from "./src/routes/UserRoute.js";  
import workspaceRoutes from "./src/routes/Workspace.js"
import taskRoutes from "./src/routes/TaskRoute.js"
dotenv.config();

const app = express();

app.use(cors(
    { origin: "*", 
      credentials: true }
    ));

    
app.use(express.json());

 
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);

async function startServer() 
{
  await connection();

  app.get("/", (req, res) => res.send("Hey there"));

  app.listen(5000, () => console.log("Server running  "));
}

startServer();
