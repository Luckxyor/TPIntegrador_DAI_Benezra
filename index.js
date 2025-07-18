import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { createEventRoutes } from "./src/controllers/event-controller.js";
import { createUserRoutes } from "./src/controllers/user-controller.js";
import { createEventLocationRoutes } from "./src/controllers/event-location-controller.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/event', createEventRoutes());
app.use('/api/user', createUserRoutes());
app.use('/api/event-location', createEventLocationRoutes());

app.use((req, res) => {
    res.status(404).json({
        error: `La ruta ${req.originalUrl} no existe`
    });
});

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`);
});