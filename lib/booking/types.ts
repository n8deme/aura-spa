import type { ExtraId } from "./pricing-config";

export type { ExtraId };

export type PackageType = "base" | "all_in" | "a_la_carte";

export type ExtraSelection = {
  extraId: ExtraId;
  quantity: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone?: string;
  notes?: string; // allergies, halal, sans alcool, goût de chicha, etc.
};

export type PricingSelection = {
  packageType: PackageType;
  guestCount: number;
  extraHours?: number; // "à la carte" uniquement, heures au-delà des 2h de base
  extras?: ExtraSelection[]; // "à la carte" uniquement
};

export type BookingSelection = PricingSelection & {
  startTime: string; // ISO 8601
};

export type PriceLineItem = {
  label: string;
  amount: number;
};

export type PriceBreakdown = {
  durationHours: number;
  lineItems: PriceLineItem[];
  total: number;
};

export type BookingRecord = {
  id: string;
  startTime: string;
  endTime: string;
  packageType: PackageType;
  guestCount: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerNotes: string | null;
  status: "pending" | "confirmed" | "cancelled";
  stripePaymentId: string | null;
  createdAt: string;
};
