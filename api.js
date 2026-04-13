const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return payload;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function toAssetUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${API_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

export async function fetchDesigns() {
  const payload = await request("/api/designs");
  return payload.data || [];
}

export async function fetchDesign(designId) {
  const payload = await request(`/api/designs/${designId}`);
  return payload.data;
}

export async function createOrder(order) {
  const payload = await request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });

  return payload.data;
}
