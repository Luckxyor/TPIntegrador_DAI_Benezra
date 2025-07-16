import express from "express";
import cors from "cors";

import EventRouter from "./src/routes/event-routes.js";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/event', EventRouter);

// Middleware para manejar rutas que no existen (404)
app.use((req, res) => {
    res.status(404).json({
        error: `La ruta ${req.originalUrl} no existe`
    });
});

app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`);
});