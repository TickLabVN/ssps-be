export const cookieOptions = {
    signed: false,
    //TODO: using envs
    secure: process.env.isProduction,
    path: '/',
    httpOnly: true
};
