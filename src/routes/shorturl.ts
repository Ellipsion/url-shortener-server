import express from "express";
import { checkCustomCodeAvailability, createUrl, deleteUrl, getAllUrl, getShortUrl, redirectToUrl, toggleArchived, toggleFavorite, updateCustomCode, updateUrl } from "../controllers/shorturl";
import { verifyToken } from "../middleware/auth";

const router = express.Router();
const protectedRoutes = express.Router();

// @public
router.get("/redirect/:code", redirectToUrl);

// @private [user]
protectedRoutes
.use(verifyToken) // provides userId to req
.get    ("/", getAllUrl)
.get    ("/:id", getShortUrl)
.post   ("/", createUrl)
.post    ("/custom", checkCustomCodeAvailability)
.patch    ("/:id/custom", updateCustomCode)
.patch ("/:id/favorite", toggleFavorite)
.patch ("/:id/archive", toggleArchived)
.patch  ("/:id", updateUrl)
.delete ("/:id", deleteUrl);


router.use(protectedRoutes);



export default router;