import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { moviesRouter } from "./movies.router";
import { errorHandler, routeNotFound } from "./middleware/error";
import integration from "./integration.json";
import { telexTickResponder } from "./movies.controller";

dotenv.config();

const app: Express = express();

app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to your favourite movie recommender"})
});
app.get("/integration.json", (req: Request, res: Response) => {
  res.status(200).json(integration);
})

app.post("/tick", telexTickResponder);
app.use("/movies", moviesRouter);

app.use(errorHandler);
app.use(routeNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App started and listening on port ${port}🚀`);
});