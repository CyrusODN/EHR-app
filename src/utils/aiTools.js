import userStore from '../store/user';
import { getChatbotServiceToken } from '../Services/AiAssitants.Service';

export const getChatbotUserId = () => {
    const user = userStore.getState().loggedInUser;
    return String(user?._id || user?.id || 'default_user');
};

export const extractToolSessionId = (response) => {
    if (!response) return null;

    return (
        response?.data?.sessionId ||
        response?.data?.id ||
        response?.sessionId ||
        response?.id ||
        null
    );
};

export const extractToolMessage = (response) => {
    if (!response) return '';

    return (
        response?.data?.message ||
        response?.data?.response ||
        response?.message ||
        response?.response ||
        ''
    );
};

export const extractToolSessions = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
};

export const resolveChatbotServiceToken = async (existingToken) => {
    if (existingToken) return existingToken;

    const response = await getChatbotServiceToken();
    return response?.serviceToken || null;
};
