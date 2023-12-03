import { envs } from '@configs';
import { MUST_LOGIN_FIRST, PERMISSION_DENIED } from '@constants';
import jwt from 'jsonwebtoken';
import { RolesValidation } from 'src/types/auth';

export const checkRoles: RolesValidation = (allowedRoles) => (req, res, done) => {
    const token = req.cookies.token;
    if (!token) return res.unauthorized(MUST_LOGIN_FIRST);
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedPayload: any = jwt.verify(token, envs.JWT_SECRET);
        req.roles = decodedPayload['roles'];

        const result = req.roles.map((role) => allowedRoles.includes(role)).find((val) => val === true);
        if (!result) return res.forbidden(PERMISSION_DENIED);
        done();
    } catch (err) {
        req.log.info(err);
        return res.forbidden(PERMISSION_DENIED);
    }
};
