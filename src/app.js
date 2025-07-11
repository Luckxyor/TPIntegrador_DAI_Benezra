
import express from 'express';
import eventRouter from './routes/eventRouter.js';

const app = express();
app.use(express.json());

app.use('/api/event', eventRouter);


app.use((req,res)=>{
    res.status(404).send("Ruta no encontrada");
});

export default app;
