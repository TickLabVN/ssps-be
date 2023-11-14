// import { envs } from '@configs';
import { google } from 'googleapis';

export const googleOAuth2Client = new google.auth.OAuth2(
    //TODO: using envs
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

export const getUserInfo = async (authorizationCode: string) => {
    const { tokens } = await googleOAuth2Client.getToken(authorizationCode);
    googleOAuth2Client.setCredentials(tokens);

    const peopleApi = google.people({ version: 'v1', auth: googleOAuth2Client });
    const userInfo = await peopleApi.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names'
    });

    const userEmail = userInfo.data.emailAddresses?.[0].value;
    const isVerifiedEmail = userInfo.data.emailAddresses?.[0].metadata?.verified || false;
    const userName = userInfo.data.names?.[0].displayName;
    return {
        userEmail,
        userName,
        isVerifiedEmail
    };
};
