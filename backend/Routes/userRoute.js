import express from "express";
import isLogin from '../middleware/isLogin.js'
import { getUserBySearch,getCurrentChatters } from "../routeControllers/userhandlerController.js";
const router=express.Router();

router.get('/search',isLogin,getUserBySearch);
router.get('/getcurrentchatters',isLogin,getCurrentChatters);

export default  router;