export interface AbandonCheckoutDto {
  abandoned_checkout_url: string;
  billing_address: Billingaddress;
  buyer_accepts_marketing: boolean;
  buyer_accepts_sms_marketing: boolean;
  cart_token: string;
  closed_at?: any;
  completed_at?: any;
  created_at: string;
  currency: Currency;
  customer: Customer;
  customer_locale: string;
  device_id: number;
  discount_codes: Discountcode2[];
  email: string;
  gateway: string;
  id: number;
  landing_site: string;
  line_items: Lineitems;
  location_id: number;
  note?: any;
  phone: Phone;
  presentment_currency: Presentmentcurrency;
  referring_site: string;
  shipping_address: Shippingaddress;
  sms_marketing_phone: string;
  shipping_lines: Shippinglines;
  source_name: string;
  subtotal_price: string;
  tax_lines: Taxlines;
  taxes_included: boolean;
  token: string;
  total_discounts: string;
  total_duties: string;
  total_line_items_price: string;
  total_price: string;
  total_tax: string;
  total_weight: number;
  updated_at: string;
  user_id: number;
}

interface Taxlines {
  price: string;
  rate: number;
  title: string;
  channel_liable: boolean;
}

interface Shippinglines {
  code: string;
  price: string;
  source: string;
  title: string;
}

interface Shippingaddress {
  address1: string;
  address2: string;
  city: string;
  company?: any;
  country: string;
  first_name: string;
  last_name: string;
  latitude: string;
  longitude: string;
  phone: string;
  province: string;
  zip: string;
  name: string;
  country_code: string;
  province_code: string;
}

interface Presentmentcurrency {
  presentment_currency: string;
}

interface Phone {
  phone: string;
}

interface Lineitems {
  fulfillment_service: string;
  grams: number;
  price: string;
  product_id: number;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  title: string;
  variant_id: number;
  variant_title: string;
  vendor: string;
}

interface Discountcode2 {
  discount_code: Discountcode;
}

interface Discountcode {
  id: number;
  code: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface Customer {
  accepts_marketing: boolean;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  note?: any;
  orders_count: string;
  state?: any;
  total_spent: string;
  updated_at: string;
  tags: string;
}

interface Currency {
  currency: string;
}

interface Billingaddress {
  address1: string;
  address2: string;
  city: string;
  company?: any;
  country: string;
  country_code: string;
  default: boolean;
  first_name: string;
  id: number;
  last_name: string;
  name: string;
  phone: string;
  province: string;
  province_code: string;
  zip: string;
}
