/**
 * WedLink Global Business Configuration
 * Centralized settings for pricing, customer support, and payment verification.
 */

export const BUSINESS_CONFIG = {
  brandName: "WedLink",
  tagline: "Sri Lanka's #1 Luxury Digital Wedding Invitation Platform",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "94771234567",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@wedlink.lk",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://wedlink.lk",

  // Sri Lankan Bank Transfer Details for Customer Package Upgrades
  bankTransfer: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Commercial Bank of Ceylon",
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "WedLink Invitations",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "8009123456",
    branch: process.env.NEXT_PUBLIC_BANK_BRANCH || "Colombo Grand Central",
    frimiOrGenie: process.env.NEXT_PUBLIC_FRIMI_NUMBER || "0771234567",
  },
};
