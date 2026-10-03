
type Response = {
    "accessToken": string,
    "user": {
        "id": string,
        "username": string,
        "email": string
    },
    "message": string;
}

const BASE_URL = "http://localhost:3000";

export const callRefreshToken = async (): Promise<Response> => {

    const refreshEndpoint = new URL("/refresh", BASE_URL);

    const response = await fetch(refreshEndpoint, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        throw new Error("failed to restore session");
    }

    const data: Response = await response.json();
    return data;

}