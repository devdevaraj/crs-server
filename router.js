import { Router } from "express";

import * as user from "./controllers/user.controller.js";
import * as content from "./controllers/content.controller.js";
import * as docs from "./controllers/docs.controller.js";
import { Auth,Admin } from "./middleware/auth.js";

const router = Router();

router.route("/authenticate").get(user.authenticate,(req, res) => res.status(200).json("ok"));
router.route("/profile").get(Auth, user.profile);
router.route("/fetch-users").get(Auth, Admin, user.fetchUsers);
router.route("/get-content").get(content.getContent);
router.route("/get-documents").get(docs.getDocs);
router.route("/get-private-docs").get(Auth, docs.getDocs);

router.route("/authenticate").post(Auth, user.authenticate,(req, res) => res.status(200).json("ok"));
router.route("/register").post(Auth, Admin,user.register);
router.route("/login").post(user.login);
router.route("/set-content").post(Auth, Admin, content.setContent);
router.route("/set-document").post(Auth, Admin, docs.setDocs);


router.route("/reset-password").put(Auth, user.resetPassword);
router.route("/update-user").put(Auth, user.update);
router.route("/update-users/:userId").put(Auth, Admin, user.updateUsers);
router.route("/update-content").put(Auth, Admin, content.updateContent);
router.route("/update-document").put(Auth, Admin, docs.updateDocs);
router.route("/reset-password").put(Auth, Admin, user.reset);

router.route("/remove-user").delete(Auth, Admin, user.remove);
router.route("/remove-content").delete(Auth, Admin, content.remove);
router.route("/remove-document").delete(Auth, Admin, docs.remove);

export default router;