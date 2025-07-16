import express from "express";
import cors from "cors";
import ProvinceRouter from "./src/controllers/province-controller.js";
const app = express();
const port = 3000;
// Inclusión de los Middlewares
app.use(cors());
app.use(express.json());
//app.use('/front', express.static('public'));
//app.use('/api/event', EventRouter);
app.use('/api/provinces', ProvinceRouter);
//app.use('/api/user', UserRouter);
//app.use(unknownEndpoint);
app.listen(port, () => {
    console.log(`"server" Listening on port ${port}`);
});