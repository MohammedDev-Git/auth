import { callRefreshToken } from "./callRefreshToken";

export type HeadersConfig = {
    body?: unknown,
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    token?: string | null,
    headers?: Record<string, string>,
    controller?: AbortController,
    credentials?: RequestCredentials,
}

const BASE_URL = "http://localhost:3000";

export const apiClient = async <T>(endpoint: string, requestConfig: HeadersConfig, delay?: number, retry?: boolean, updateToken?: (newToken: string) => void, logout?: () => void): Promise<T> => {

    const { method = "GET", token, body, headers = {}, controller, } = requestConfig;

    const requestUrl = new URL(endpoint, BASE_URL);

    if (delay) {
        requestUrl.searchParams.set("delay", delay.toString());
    }

    const headersConfig: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    }

    if (token) {
        headersConfig["Authorization"] = `Bearer ${token}`;
    }

    try {

        const response = await fetch(requestUrl, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: headersConfig,
            signal: controller?.signal,
            credentials: "include",
        });

        if (!response.ok && token) {
            const errorData = await response.json().catch(() => ({}));

            const error = new Error(errorData.message || "operation failed, try later") as Error & { code: string, status: number };
            error.code = errorData.code;
            error.status = errorData.status;

            if ((error.status === 401 || error.status === 403) && !retry) {

                try {
                    const {accessToken} = await callRefreshToken();
                    
                    updateToken?.(accessToken);

                    return apiClient(endpoint, { ...requestConfig, token: accessToken }, delay, true, updateToken, logout);

                } catch (err) {

                    logout?.();

                    console.log("session timeout, please log in again");

                    throw new Error("session timeout, please log in again");

                }

            }

            throw error;
        }

        return response.json();

    } catch (err) {

        if (err instanceof Error) {

            if (err.name === "AbortError") throw err;

            if (err instanceof TypeError) {
                if (!navigator.onLine) {
                    throw new Error("you are offline", { cause: err });
                } else {
                    throw new Error("server is offline", { cause: err });
                }
            }

            throw err;

        } else {
            throw new Error("unexpected error occured, try later", { cause: err });
        }
    }

}