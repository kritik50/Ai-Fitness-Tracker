import axios from "axios";

type ApiErrorPayload = {
    error?: {
        message?: string;
    };
};

export const getApiErrorMessage = (
    error: unknown,
    fallback = "Something went wrong. Please try again."
) => {
    if (axios.isAxiosError<ApiErrorPayload>(error)) {
        return error.response?.data?.error?.message || error.message || fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};
