/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PEMA - Laravel Meta API Service Integration
 */

// Load API configs with default credentials as a reliable fallback
const BASE_URL = "https://www.shabpltsystem.com/app/sanctum_app/api";
const WORKAREA_UUID = (import.meta as any).env?.VITE_WORKAREA_UUID || "57602f3a-f422-4f0b-8628-f6d512c6ef9a";
const WORKAREA_API_KEY = (import.meta as any).env?.VITE_WORKAREA_API_KEY || "WA-57602F3A-1766452056145-ENQZJW24";

// Construction of Meta API full path
const API_BASE = `${BASE_URL}/meta_api/${WORKAREA_UUID}/${WORKAREA_API_KEY}`;

export interface MetadataPayload<T = any> {
  datakey: string;
  datagroup: string;
  datatype: "SYSTEM" | "APP" | "USER" | "PUBLIC" | "CUSTOM";
  metadata: T;
}

export interface LaravelMetaResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

/**
 * Enhanced fetch wrapper that prints comprehensive API logs to the developer console.
 */
async function apiCall<R = any>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: any
): Promise<R> {
  const url = `${API_BASE}${endpoint}`;
  
  // Create beautiful styling for console logs to comply with tracking requests
  console.log(
    `%c[Meta API Request] %c${method} %c${url}`,
    "color: #D4AF37; font-weight: bold; font-family: monospace;",
    "color: #00FFCC; font-weight: bold; font-family: monospace;",
    "color: #ECEFF1; font-family: monospace;"
  );

  if (body) {
    console.log(
      `%c[Payload]`,
      "color: #FFA726; font-weight: bold; font-family: monospace;",
      body
    );
  }

  const options: RequestInit = {
    method,
    headers: {
      "Accept": "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const startTime = performance.now();
    const response = await fetch(url, options);
    const duration = (performance.now() - startTime).toFixed(1);
    
    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log(
      `%c[Meta API Response] %cStatus: ${response.status} %c(${duration}ms)`,
      "color: #D4AF37; font-weight: bold; font-family: monospace;",
      response.ok ? "color: #4CAF50; font-weight: bold;" : "color: #F44336; font-weight: bold;",
      "color: #90A4AE; font-size: 11px;",
      responseData
    );

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${JSON.stringify(responseData)}`);
    }

    return responseData as R;
  } catch (error) {
    console.error(
      `%c[Meta API Failure]`,
      "color: #FF5252; font-weight: bold; font-family: monospace;",
      error
    );
    throw error;
  }
}

export const metaApi = {
  /**
   * Check if backend API is reachable and key is valid.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await apiCall<{ success: boolean }>("/", "GET");
      return !!res.success;
    } catch {
      return false;
    }
  },

  /**
   * Fetch all records for the workarea
   */
  async getAll(): Promise<any[]> {
    return apiCall<any[]>("/getall", "GET");
  },

  /**
   * Fetch all rows under a particular logical table (datagroup)
   */
  async getByDatagroup<T = any>(datagroup: string): Promise<any[]> {
    return apiCall<any[]>(`/datagroup/${datagroup}`, "GET");
  },

  /**
   * Fetch a single metadata item by key
   */
  async getByKey<T = any>(datakey: string): Promise<T | null> {
    try {
      return await apiCall<T>(`/get/${datakey}`, "GET");
    } catch {
      return null;
    }
  },

  /**
   * Save or update pre-orders or interaction statistics.
   */
  async save<T = any>(payload: MetadataPayload<T>): Promise<LaravelMetaResponse> {
    return apiCall<LaravelMetaResponse>("/save", "POST", payload);
  },

  /**
   * Permanently delete metadata record
   */
  async delete(datakey: string): Promise<{ success: boolean; message?: string }> {
    return apiCall<{ success: boolean; message?: string }>(`/delete/${datakey}`, "DELETE");
  }
};
