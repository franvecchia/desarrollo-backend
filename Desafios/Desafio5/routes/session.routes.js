import { Router } from "express";
import passport from "passport";
import { testLogin, destroySession } from "../controllers/session.controller.js";

const sessionRouter = Router();

sessionRouter.post("/login", passport.authenticate('login'), testLogin);
sessionRouter.get("/logout", destroySession);

export default sessionRouter;