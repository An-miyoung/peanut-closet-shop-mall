// user authorization
export interface MenuItems {
  href: string;
  icon: React.JSX.Element;
  label: string;
}

export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  // socailLogin user 는 이 앱에서 폼필드값을 받아서 signup 하지 않는다
  role: "admin" | "user";
  avatar?: { url: string; id: string };
  verified: boolean;
}

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin" | "socialLogin";
  verified: boolean;
  image?: string;
  socialId?: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}

export interface SigninCredentials {
  email: string;
  password: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  userId: string;
  token: string;
  password: string;
}
// Profile
export interface UserProfileToUpdate {
  id: string;
  name: string;
  avatar?: { url: string; id: string };
}

// Product
export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  bulletPoints?: string[];
  price: {
    mrp: number;
    salePrice: number;
    saleOff: number;
  };
  category: string;
  quantity: number;
}

export interface NewProductInfo {
  title: string;
  description: string;
  bulletPoints?: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
  thumbnail?: File;
  images?: File[];
}

export interface NewProduct {
  title: string;
  description: string;
  bulletPoints?: string[];
  thumbnail: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
  price: {
    base: number;
    discounted: number;
  };
  quantity: number;
  category: string;
  rating?: number;
}

export interface ProductResponse {
  id: string;
  title: string;
  bulletPoints?: string[];
  thumbnail: {
    url: string;
    id: string;
  };
  images?: {
    url: string;
    id: string;
  }[];
  description: string;
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  quantity: number;
}

export interface ProductToUpdate {
  title: string;
  description: string;
  bulletPoints: string[] | undefined;
  price: {
    base: number;
    discounted: number;
  };
  category: string;
  quantity: number;
  thumbnail?: { url: string; id: string };
  images?: { url: string; id: string }[];
}

export interface NewCartRequest {
  productId: string;
  quantity: number;
}

export interface NewFeaturedProduct {
  banner: { url: string; id: string };
  title: string;
  link: string;
  linkTitle: string;
}

export interface UpdateFeaturedProduct {
  banner?: { url: string; id: string };
  title: string;
  link: string;
  linkTitle: string;
}

// cart
export interface CartProduct {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItems {
  id: string;
  totalQty: number;
  totalPrice: number;
  products: CartProduct[];
}

// stripe
export interface stripeCustomer {
  metadata: {
    userId: string;
    cartId: string;
    type: "checkout" | "instance-checkout";
    product: string;
  };
}

// orders
type product = {
  id: string;
  title: string;
  thumbnail: string;
  totalPrice: number;
  price: number;
  quantity: number;
};

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    address: { [key: string]: string | null };
  };
  subTotal: number;
  products: product[];
  deliveryStatus: string;
}

// Review
export interface ReviewRequestBody {
  productId: string;
  rating: number;
  comment?: string;
}
