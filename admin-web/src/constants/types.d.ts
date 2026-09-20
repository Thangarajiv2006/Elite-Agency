export interface AuthState {
  user: {
    _id: string;
    agencyName: string;
    name: string;
    email: string;
    phone: string;
    pan: string;
    gst: string;
    fssai: string;
    address: {
      plotNo: string;
      street: string;
      village: string;
      district: string;
      state: string;
      stateCode: string;
      pinCode: string;
    };
  } | null;
  token: string | null;
}

export interface LoginAction {
  type: string;
  payload: {
    user: AuthState["user"];
    token: string;
  };
}

export type AuthForm = {
  agencyName: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  gst: string;
  fssai: string;
  plotNo: string;
  street: string;
  village: string;
  district: string;
  state: string;
  stateCode: string;
  pinCode: string;
  password: string;
  otp?: string;
  token?: string;
};

//Worker

export interface WorkerState {
  _id?: string;
  name: string;
  email: string;
  phone: number | string;
  address: {
    plotNo: string;
    street: string;
    village: string;
    district: string;
  };
}

export interface WorkerAction {
  type: string;
  payload?: any;
}

//categories

export interface categoryState {
  _id?: string;
  name: string;
}

export interface categoryAction {
  type: string;
  payload?: any;
}

//shops

export interface shopState {
  shops: {
    _id?: string;
    shopName: string;
    ownerName: string;
    phone: string;
    mobile?: string;
    email?: string;
    fssai?: string;
    gst?: string;
    pan?: string;
    address: {
      village: string;
      district: string;
      landmark?: string;
      state: string;
      pinCode: string;
      stateCode: string;
    };
  }[];
  village: Set<string>;
  district: Set<string>;
  currentPage: number;
  totalPages: number;
  totalShops: number;
  quriedShops: number;
}

export interface shopAction {
  type: string;
  payload?: any;
}

// products

export interface productState {
  products: {
    _id?: string;
    name: string;
    costPrice: number;
    sellingPrice: number;
    MRP: number;
    HSN: string;
    CGST: number;
    SGST: number;
    stock: number;
    unit: string;
    categoryId: string;
    createdBy: string;
  }[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  quriedProducts: number;
}

export interface productAction {
  type: string;
  payload?: any;
}

// stocks

export interface stockState {
  products: {
    _id?: string;
    name: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
    unit: string;
  }[];
  history: {
    _id: string;
    category: { name: string };
    products: {
      product: { name: string; costPrice: number; sellingPrice: number; MRP?: number; HSN: string; CGST: number; SGST: number; unit: string };
      quantity: number;
      previousStock: number;
      updatedStock: number;
    }[];
    type: string;
    note: string;
    createdAt: string;
  }[];
  historyTotal: number;
  historyPage: number;
  historyTotalPages: number;
  selectedCategory: string | null;
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface stockAction {
  type: string;
  payload?: any;
}

// orders

export interface Order {
  _id: string;
  invoiceNo: string;
  invoiceDate: string;
  orderedProducts: {
    product: {
      name: string;
      costPrice?: number;
      sellingPrice?: number;
      MRP?: number;
      HSN?: string;
      CGST?: number;
      SGST?: number;
      unit: string;
    };
    quantity: number;
    free: number;
    discount: number;
    netPrice: number;
    taxAmount: number;
    totalAmount: number;
  }[];
  shop: {
    _id: string;
    shopName: string;
    ownerName: string;
    address: {
      village: string;
      district: string;
      landmark?: string;
      state: string;
      stateCode: string;
      pinCode: string;
    };
    fssai?: string;
    gst?: string;
    pan?: string;
    mobile?: string;
    email?: string;
  };
  subTotal: number;
  totalGST: number;
  grandTotal: number;
  roundOff: number;
  paymentMode: string;
  payments: {
    _id: string;
    amount: number;
    method: string;
    date: string;
    reference: string;
    note: string;
  }[];
  dueDate?: string;
  createdBy: string;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
  createdAt: string;
  updatedAt: string;
}

export interface orderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  totalGrandTotal?: number;
  totalPaidAmount?: number;
  totalDueAmount?: number;
}

export interface orderAction {
  type: string;
  payload?: any;
}
