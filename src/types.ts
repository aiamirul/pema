/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShoeVariant {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  colors: string[];
  gradientClass: string; // Tailwind gradient for backgrounds
  borderAccent: string; // Tailwind border
  badgeColor: string; // Tailwind text/badge colors
  images: {
    main: string; // Main high resolution generated path
    angle?: string;
  };
  tags: string[];
  sizes: number[];
  stockCount: number;
}

export interface CartItem {
  id: string; // unique item id = {variantId}_{size}
  variant: ShoeVariant;
  size: number;
  quantity: number;
}

export interface PreOrderSubmission {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  postalCode: string;
  size: number;
  variantId: string;
  variantName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  notes?: string;
}

export interface ActivePreOrder {
  id: string; // unique order ID (e.g. PEMA-XXXXXXXX)
  submittedData: PreOrderSubmission;
  timestamp: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}
