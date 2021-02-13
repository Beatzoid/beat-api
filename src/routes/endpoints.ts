import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
    res.json({
        message:
            "Hello API user! This is a list of all routes avalible for you to use",
        routes: {
            "/": "A route that displays this message",
            "/emergencyMeeting?text=text":
                "Generates an emergency meeting image. Text is the text you want, example:"
        }
    });
});

export default router;
