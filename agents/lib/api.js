import fetch from "node-fetch";

export function createAPIClient(baseURL, defaultHeaders = {}) {
  async function request(method, path, body = null, options = {}) {
    const url = `${baseURL}${path}`;

    const headers = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...(options.headers || {})
    };

    const fetchOptions = {
      method,
      headers
    };

    if (body !== null) {
      fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOptions);

    let text;
    try {
      text = await res.text();
    } catch {
      throw new Error(`Failed to read response from ${url}`);
    }

    if (!res.ok) {
      throw new Error(
        `API error ${res.status} ${res.statusText} at ${url}\nResponse: ${text}`
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return {
    get: (path, options) => request("GET", path, null, options),
    post: (path, body, options) => request("POST", path, body, options),
    put: (path, body, options) => request("PUT", path, body, options),
    delete: (path, options) => request("DELETE", path, null, options)
  };
}
        