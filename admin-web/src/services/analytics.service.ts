import axios from "@/helpers/axios";

export const getRevenue = async (range?: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (range) params.append("range", range);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await axios.get(`/analytics/revenue?${params.toString()}`);
  return res.data;
};

export const getTopProducts = async (startDate?: string, endDate?: string, limit?: number) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (limit) params.append("limit", String(limit));
  
  const res = await axios.get(`/analytics/top-products?${params.toString()}`);
  return res.data;
};

export const getCustomers = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await axios.get(`/analytics/customers?${params.toString()}`);
  return res.data;
};

export const getPayments = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await axios.get(`/analytics/payments?${params.toString()}`);
  return res.data;
};

export const getStatus = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await axios.get(`/analytics/status?${params.toString()}`);
  return res.data;
};

export const getSalesTime = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await axios.get(`/analytics/sales-time?${params.toString()}`);
  return res.data;
};

export const getRecentInvoices = async (limit: number = 10) => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  
  const res = await axios.get(`/analytics/recent?${params.toString()}`);
  return res.data;
};
