import { Service, Package } from "./types";

export const SERVICES: Service[] = [
  {
    id: "cleaning",
    name: "Teeth Cleaning",
    description: "Professional dental cleaning to remove plaque and tartar buildup.",
    price: "PKR 2,500",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    description: "Advanced whitening treatment for a brighter, more confident smile.",
    price: "PKR 6,000",
  },
  {
    id: "implants",
    name: "Dental Implants",
    description: "Permanent solution for missing teeth with high-quality implants.",
    price: "PKR 45,000",
  },
  {
    id: "root-canal",
    name: "Root Canal Treatment",
    description: "Expert treatment to save damaged teeth and relieve pain.",
    price: "PKR 12,000",
  },
  {
    id: "braces",
    name: "Braces / Orthodontics",
    description: "Straighten your teeth with traditional or modern orthodontic solutions.",
    price: "PKR 80,000",
  },
  {
    id: "cosmetic",
    name: "Cosmetic Dentistry",
    description: "Transform your smile with veneers, bonding, and more.",
    price: "PKR 15,000",
  },
];

export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic Checkup Package",
    items: ["Consultation", "Basic Cleaning"],
    price: "PKR 2,000",
  },
  {
    id: "smile",
    name: "Smile Care Package",
    items: ["Cleaning", "Whitening", "Dental Checkup"],
    price: "PKR 8,000",
    discount: "10%",
  },
  {
    id: "premium",
    name: "Premium Dental Package",
    items: ["Full Checkup", "Whitening", "X-Ray", "Consultation"],
    price: "PKR 15,000",
    discount: "15%",
  },
];

export const EMERGENCY_CONTACT = "0313-2194343";
