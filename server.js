import "express-async-errors";
import cors from "cors";
import 'dotenv/config';
import express from "express";
import { UPLOAD_FOLDER } from "./src/config/upload.js";
import routes from "./src/routes/index.js";
import AppError from "./src/utils/AppError.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(UPLOAD_FOLDER));
app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor...",
  });
});

const PORT = process.env.PORT;

app.listen(PORT);
