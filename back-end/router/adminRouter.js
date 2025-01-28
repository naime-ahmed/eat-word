import { suspendUser } from "../controller/admin/suspendUserController";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken";
import { verifyIsAdmin } from "../middlewares/validate/verifyIsAdmin";
// external imports
const router = express.Router();

// get users
// router.get("/");

// suspend account
router.patch("/suspend/:userId", verifyAccessToken, verifyIsAdmin, suspendUser);

export default router;
