import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';
import recordRoutes from './routes/recordRoutes'
import {connectDB} from './config/connectDB'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
dotenv.config();


connectDB();


const app = express();

app.use(cors());
app.use(express.json());



app.use('/auth',loginRoutes);
app.use('/record',recordRoutes);
app.use('/user',userRoutes);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
