export const cookieOptions = {
    signed: false,
    //TODO: using envs
    secure: !!process.env.isProduction || false,
    path: '/',
    httpOnly: true
};
