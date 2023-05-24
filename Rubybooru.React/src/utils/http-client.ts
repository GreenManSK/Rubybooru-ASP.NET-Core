export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestDataType = any;

export class HttpClient {
  private readonly apiUrl: string;

  public constructor(apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
  }

  public get<T>(endpoint: string, data?: RequestDataType): Promise<T> {
    return this.fetch(endpoint, "GET", data);
  }

  public delete<T>(endpoint: string, data?: RequestDataType): Promise<T> {
    return this.fetch(endpoint, "DELETE", data);
  }

  public post<T>(endpoint: string, data?: RequestDataType): Promise<T> {
    return this.fetch(endpoint, "POST", data);
  }

  public put<T>(endpoint: string, data?: RequestDataType): Promise<T> {
    return this.fetch(endpoint, "PUT", data);
  }

  public fetch<T>(
    endpoint: string,
    method: HttpMethod,
    data?: RequestDataType
  ): Promise<T> {
    const config = {
      method,
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        "Content-Type": data ? "application/json" : "",
      },
    };

    return window
      .fetch(`${this.apiUrl}/${endpoint.replace(/^\//, "")}`, config)
      .then(async (response) => {
        try {
          const data = await response.json();
          if (response.ok) {
            return data;
          } else {
            return Promise.reject(data);
          }
        } catch (_) {
          return;
        }
      });
  }
}
