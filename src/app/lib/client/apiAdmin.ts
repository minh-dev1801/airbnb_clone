import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosInstance extends AxiosInstance {
    get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    delete<T = any>(
        url: string,
        config?: InternalAxiosRequestConfig
    ): Promise<T>;
    post<T = any>(
        url: string,
        data?: any,
        config?: InternalAxiosRequestConfig
    ): Promise<T>;
    put<T = any>(
        url: string,
        data?: any,
        config?: InternalAxiosRequestConfig
    ): Promise<T>;
}

export const ACCESS_TOKEN: string = "authToken";

export const TOKEN_CYBERSOFT: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBTw6FuZyAxNSIsIkhldEhhblN0cmluZyI6IjExLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1NzU0ODgwMDAwMCIsIm5iZiI6MTczMzg1MDAwMCwiZXhwIjoxNzU3Njk2NDAwfQ.5vww18nCtO2mffvALHhzwa38Gyr82SqzU0hb0DLMGx0";
export const DOMAIN: string = "https://airbnbnew.cybersoft.edu.vn/api/";

export const http: CustomAxiosInstance = axios.create({
    baseURL: DOMAIN,
    timeout: 30000,
}) as CustomAxiosInstance;

http.interceptors.request.use(
    (req: InternalAxiosRequestConfig<any>) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (req.headers) {
            req.headers.set("token", accessToken ?? ""); 
            req.headers.set("tokenCybersoft", TOKEN_CYBERSOFT);
        }
        return req;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);





http.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data.content;
    },
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401:
                    console.error("Unauthorized - Please login again");
                    break;

                case 403:
                    console.error(
                        "You do not have permission to access this resource"
                    );
                    break;

                case 404:
                    console.error("Resource not found");
                    break;

                case 500:
                    console.error("Server error, please try again later");
                    break;
            }
        } else if (error.request) {
            console.error("Cannot connect to the server");
        } else {
            console.error("Error:", error.message);
        }

        return Promise.reject(error);
    }
);
