import axios from "axios";

const BASE_URL = "http://localhost:3000";

const privateApiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

privateApiClient.interceptors.request.use((config) => {


    return config;
})

privateApiClient.interceptors.response.use(
    (res) => res,
    (err) => {

        if (err instanceof Error) {

            if (err instanceof TypeError) {

                if (!navigator.onLine) {
                    throw new Error("internet connection failed")
                } else {
                    throw new Error("server is closed")
                }

            }
            
            throw err;
        } else {
            throw new Error("unexpected error happened");
        }

    }
)

export default privateApiClient;