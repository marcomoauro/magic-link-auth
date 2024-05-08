import Router from '@koa/router';
import {healthcheck} from "./api/healthcheck.js";
import {authenticate, responseCompressible, routeToFunction} from "./middlewares.js";
import {sendMagicLink, loginByMagicLink} from "./controllers/auth.js";
import {me, checkUsernameAvailability, setUsername} from "./controllers/user.js";
import {testCompression} from "./controllers/test.js";

const router = new Router();

router.get('/healthcheck', routeToFunction(healthcheck));

router.post('/send-magic-link', routeToFunction(sendMagicLink));
router.post('/login-by-magic-link', routeToFunction(loginByMagicLink));

router.get('/users/me', authenticate, routeToFunction(me));
router.get('/test-compression', responseCompressible, routeToFunction(testCompression));
router.get('/test-no-compression', routeToFunction(testCompression));
router.get('/check-username', authenticate, routeToFunction(checkUsernameAvailability));
router.post('/user/username', authenticate, routeToFunction(setUsername));

export default router;