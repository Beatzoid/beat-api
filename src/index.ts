import express from "express";
import endpoints from "./routes/endpoints";

const app = express();

app.get("/", endpoints);

app.listen(process.env.PORT || 5000, () =>
    console.log(
        `Server listening on http://localhost:${process.env.PORT || 5000}`
    )
);
