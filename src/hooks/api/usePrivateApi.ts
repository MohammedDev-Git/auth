import { apiClient, type HeadersConfig } from "../../api/apiClient";
import { useAuth } from "../../lessons/authentication/contexts/AuthProvider";

export const usePrivateApi = () => {
    const { token ,updateAccessToken,logout} = useAuth();

    const privateApiClient = <T>(endpoint: string, requestConfig: HeadersConfig = {}) => {
        return apiClient<T>(endpoint, { ...requestConfig, token }, 2000,false,updateAccessToken,logout)
    }

    return { privateApiClient };
}