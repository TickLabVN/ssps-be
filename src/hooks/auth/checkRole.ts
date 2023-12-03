import { envs } from '@configs';
import { PERMISSION_DENIED } from '@constants';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RolesValidation } from 'src/types/auth';

export const checkRoles: RolesValidation = (allowedRoles) => (req, res, done) => {
    const token = req.cookies.token;
    try {
        const decodedPayload = jwt.verify(token || '', envs.JWT_SECRET) as JwtPayload;
        req.roles = decodedPayload['roles'];
        const result = req.roles.map((role) => allowedRoles.includes(role)).find((val) => val === true);
        if (!result) return res.forbidden(PERMISSION_DENIED);
        done();
    } catch (err) {
        req.log.info(err);
        return res.forbidden(PERMISSION_DENIED);
    }
};
