import { envs } from '@configs';
import { google } from 'googleapis';

export const getUserInfo = async (authorizationCode: string) => {
    try {
        const googleOAuth2Client = new google.auth.OAuth2(envs.GOOGLE_CLIENT_ID, envs.GOOGLE_CLIENT_SECRET, envs.GOOGLE_REDIRECT_URL);

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
    } catch (error) {
        throw new Error(error);
    }
};
