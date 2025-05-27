import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Comment, Position, PositionWithSlug } from "./client/types/types";
import { slugify } from "transliteration";
import { transliterate } from "transliteration";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
  });
};

export const formatDateToDDMMYYYY = (date?: Date): string => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatISOToDDMMYYYY = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  return formatDateToDDMMYYYY(date);
};

export const convertToISODate = (
  dateString: string,
  hour: string = "17:00:00.000Z"
): string => {
  const [day, month, year] = dateString.split("/").map(Number);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}T${hour}`;
};

export const formatDateTime = (dateInput: Date) => {
  const date = new Date(dateInput);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears >= 2) {
    return `${diffInYears} năm trước`;
  } else if (diffInYears === 1) {
    return `một năm trước`;
  } else if (diffInMonths >= 2) {
    return `${diffInMonths} tháng trước`;
  } else if (diffInMonths === 1) {
    return `một tháng trước`;
  } else if (diffInDays >= 2) {
    return `${diffInDays} ngày trước`;
  } else if (diffInDays === 1) {
    return `một ngày trước`;
  } else if (diffInHours >= 2) {
    return `${diffInHours} giờ trước`;
  } else if (diffInHours === 1) {
    return `một giờ trước`;
  } else if (diffInMinutes >= 2) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes === 1) {
    return `một phút trước`;
  } else {
    return `vừa xong`;
  }
};

export const sortCommentsByIdDescending = (comments: Comment[]): Comment[] => {
  return [...comments].sort((a, b) => b.id - a.id);
};

export const convertUSDToVND = (amountInUSD: number, exchangeRate = 25000) => {
  const amountInVND = amountInUSD * exchangeRate;

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amountInVND);
};

export const generateId = () => crypto.randomUUID();

export const getTranslatedItems = <T>(
  items: T[],
  t: (key: string) => string,
  key: keyof T
): T[] => {
  return items.map((item) => ({
    ...item,
    [key]: t(String(item[key])),
  }));
};

export const mapPositionWithSlug = (data: Position[]): PositionWithSlug[] => {
  return data.map((position) => ({
    ...position,
    slug: slugify(position.tinhThanh),
  }));
};

export const getLanguages = () => [
  { name: "English", locale: "en" },
  { name: "Việt Nam", locale: "vi" },
];

export const normalizeText = (text: string): string => {
  return transliterate(text).toLowerCase();
};
