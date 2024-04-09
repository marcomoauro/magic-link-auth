import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {authenticate, routeToFunction} from "./middlewares.js";
import {sendMagicLink, loginByMagicLink} from "./controllers/auth.js";
import {me, checkUsernameAvailability, setUsername} from "./controllers/user.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

router.post('/send-magic-link', routeToFunction(sendMagicLink));
router.post('/login-by-magic-link', routeToFunction(loginByMagicLink));

router.get('/users/me', authenticate, routeToFunction(me));
router.get('/check-username', authenticate, routeToFunction(checkUsernameAvailability));
router.post('/user/username', authenticate, routeToFunction(setUsername));

export default router;