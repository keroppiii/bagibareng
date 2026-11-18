
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  const { token, headers, ...restOptions } = options;

  const accessToken =
    token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message = result?.message;

    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Terjadi kesalahan pada server."
    );
  }

  return result as T;
}

export function saveAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function removeAccessToken() {
  localStorage.removeItem("accessToken");
}
