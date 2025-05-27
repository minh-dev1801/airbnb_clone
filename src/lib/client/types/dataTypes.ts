import { IconType } from 'react-icons';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';
import { Wifi, Tv, ParkingSquare } from 'lucide-react';
import { MdIron } from 'react-icons/md';
import { FaHandsWash, FaSwimmingPool } from 'react-icons/fa';
import { Coordinates, UpdateUser } from './types';

export type NavItem = {
  key: string;
  label: string;
  href: string;
};

type ListInforPositions = {
  duration: string;
  image: string;
};

type ListHomeRooms = {
  href: string;
  title: string;
  image: string;
};

// Định nghĩa kiểu cho Icon
export type IconComponent =
  | ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  | IconType;

export type AmenityItem = {
  Icon: IconComponent;
  label: string;
};

export const amenities: AmenityItem[] = [
  { Icon: Wifi, label: "wifi" },
  { Icon: Tv, label: "tv" },
  { Icon: ParkingSquare, label: "parking" },
  { Icon: MdIron, label: "ironingBoard" },
  { Icon: FaSwimmingPool, label: "swimmingPool" },
  { Icon: FaHandsWash, label: "washingMachine" },
];

export const navItems: NavItem[] = [
  { key: "home", label: "Home", href: "" },
  { key: "about", label: "About", href: "/under-dev" },
  { key: "services", label: "Services", href: "/under-dev" },
  { key: "pricing", label: "Pricing", href: "/under-dev" },
  { key: "contact", label: "Contact", href: "/under-dev" },
];

export const listInforPositions: ListInforPositions[] = [
  {
    duration: "15 minutes drive",
    image: "/position/1.webp"
  },
  {
    duration: "3 hours drive",
    image: "/position/2.webp"
  },
  {
    duration: "6 hours drive",
    image: "/position/3.webp"
  },
  {
    duration: "10 minutes drive",
    image: "/position/4.jpg"
  },
  {
    duration: "7 hours drive",
    image: "/position/5.webp"
  },
  {
    duration: "45 minutes drive",
    image: "/position/6.webp"
  },
  {
    duration: "30 minutes drive",
    image: "/position/7.webp"
  },
  {
    duration: "5 hours drive",
    image: "/position/8.webp"
  }
]

export const listHomeRooms: ListHomeRooms[] = [
  {
    href: "/rooms/ho-chi-minh",
    title: "all",
    image: "/room/1.webp"
  },
  {
    href: "/rooms/nha-trang",
    title: "unique",
    image: "/room/2.webp"
  },
  {
    href: "/rooms/da-lat",
    title: "farm",
    image: "/room/3.webp"
  },
  {
    href: "/rooms/da-nang",
    title: "pet",
    image: "/room/4.webp"
  }
]

export const botResponses = [
  "Xin chào! Tôi có thể giúp gì cho bạn?",
  "Cảm ơn bạn đã liên hệ. Tôi sẽ hỗ trợ bạn ngay.",
  "Đây là một câu hỏi hay! Để tôi giải thích...",
  "Tôi rất tiếc, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi lại được không?",
  "Vui lòng cho tôi biết thêm chi tiết về vấn đề của bạn.",
  "Tôi đang tìm kiếm thông tin cho bạn...",
  "Đúng vậy, tôi có thể giúp bạn với vấn đề này!",
  "Đây là một demo chatbot. Trong ứng dụng thực tế, chúng tôi sẽ kết nối với API để trả lời chính xác hơn.",
  "Bạn có cần thêm thông tin gì không?",
  "Tôi hy vọng thông tin này hữu ích cho bạn!"
];

export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export const DEFAULT_UPDATE_USER_DATA: UpdateUser = {
  name: '',
  email: '',
  phone: '',
  birthday: '',
  gender: true,
};
