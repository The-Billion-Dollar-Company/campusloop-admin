import type { ComponentType } from "react"

export interface IResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

export interface ISidebarItems{
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

// User Management Types
export const Status = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPEND: "SUSPEND",
} as const;

export type Status = typeof Status[keyof typeof Status];

export const Role = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface IUser {
  _id: string;
  name: string;
  email: string;
  universityId?: string;
  phone?: string;
  presentAddress?: string;
  picture?: string;
  activeRole: Role;
  isVerified: boolean;
  isStatus: Status;
  wallet?: {
    _id: string;
    balance: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Item Management Types
export const ItemStatus = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  CANCEL: "CANCEL",
} as const;

export type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus];

export const Availability = {
  IN_STOCK: "IN_STOCK",
  RENTED: "RENTED",
  SOLD: "SOLD",
} as const;

export type Availability = typeof Availability[keyof typeof Availability];

export const ItemCategory = {
  RENT: "RENT",
  SELL: "SELL",
  SKILL: "SKILL",
} as const;

export type ItemCategory = typeof ItemCategory[keyof typeof ItemCategory];

export const ObjectCategory = {
  ELECTRONICS: "ELECTRONICS",
  BOOKS: "BOOKS",
  FURNITURE: "FURNITURE",
  CLOTHING: "CLOTHING",
  SPORTS: "SPORTS",
  OTHER: "OTHER",
} as const;

export type ObjectCategory = typeof ObjectCategory[keyof typeof ObjectCategory];

export interface IItem {
  _id: string;
  ownerId: string | IUser;
  title: string;
  description?: string;
  price: number;
  deposit?: number;
  condition?: "NEW" | "USED";
  status: ItemStatus;
  sellingCategory: ItemCategory;
  availability: Availability;
  objectCategory: ObjectCategory;
  tags?: string[];
  picture?: string;
  pictures?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TRole = "ADMIN" | "SUPER_ADMIN"
