/**
 * NFC Hardware Store for Cosmic Portals
 * Handles NFC kit sales, inventory, and order management
 */

import { createClient } from './supabase/client';

export interface HardwareProduct {
  id: string;
  name: string;
  description: string;
  category: 'business_cards' | 'signage' | 'event_badges' | 'table_tents' | 'kits';
  price: number;
  cost: number;
  profit_margin: number;
  sku: string;
  inventory_count: number;
  images: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HardwareOrder {
  id: string;
  organization_id: string;
  customer_email: string;
  shipping_address: {
    name: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface HardwareKit {
  id: string;
  name: string;
  description: string;
  target_audience: 'starter' | 'professional' | 'enterprise' | 'event_planner';
  products: Array<{
    product_id: string;
    quantity: number;
  }>;
  total_price: number;
  discount_percentage: number;
  final_price: number;
  is_popular: boolean;
  created_at: string;
}

export class HardwareStoreService {
  private supabase = createClient();

  /**
   * Get all hardware products
   */
  async getProducts(category?: string): Promise<HardwareProduct[]> {
    let query = this.supabase
      .from('hardware_products')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get hardware kits
   */
  async getHardwareKits(): Promise<HardwareKit[]> {
    const { data, error } = await this.supabase
      .from('hardware_kits')
      .select('*')
      .order('is_popular', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create hardware order
   */
  async createOrder(data: {
    organization_id: string;
    customer_email: string;
    shipping_address: any;
    items: Array<{
      product_id: string;
      quantity: number;
    }>;
  }): Promise<HardwareOrder> {
    // Calculate pricing
    const products = await this.getProducts();
    const orderItems = data.items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
    const shipping_cost = this.calculateShippingCost(subtotal, data.shipping_address);
    const tax = this.calculateTax(subtotal, data.shipping_address);
    const total = subtotal + shipping_cost + tax;

    const { data: order, error } = await this.supabase
      .from('hardware_orders')
      .insert({
        organization_id: data.organization_id,
        customer_email: data.customer_email,
        shipping_address: data.shipping_address,
        items: orderItems,
        subtotal,
        shipping_cost,
        tax,
        total,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Update inventory
    await this.updateInventory(data.items);

    return order;
  }

  /**
   * Get organization orders
   */
  async getOrganizationOrders(organizationId: string): Promise<HardwareOrder[]> {
    const { data, error } = await this.supabase
      .from('hardware_orders')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string, trackingNumber?: string): Promise<HardwareOrder> {
    const { data, error } = await this.supabase
      .from('hardware_orders')
      .update({
        status,
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get inventory status
   */
  async getInventoryStatus(): Promise<Array<{
    product_id: string;
    name: string;
    current_stock: number;
    low_stock_threshold: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  }>> {
    const { data: products } = await this.supabase
      .from('hardware_products')
      .select('id, name, inventory_count')
      .eq('is_active', true);

    return products?.map(product => ({
      product_id: product.id,
      name: product.name,
      current_stock: product.inventory_count,
      low_stock_threshold: 10,
      status: product.inventory_count > 10 ? 'in_stock' : 
              product.inventory_count > 0 ? 'low_stock' : 'out_of_stock'
    })) || [];
  }

  /**
   * Calculate shipping cost
   */
  private calculateShippingCost(subtotal: number, address: any): number {
    // Free shipping over $100
    if (subtotal >= 100) return 0;
    
    // Standard shipping rates
    const baseRate = 8.99;
    const internationalRate = 24.99;
    
    return address.country === 'US' ? baseRate : internationalRate;
  }

  /**
   * Calculate tax
   */
  private calculateTax(subtotal: number, address: any): number {
    // Simplified tax calculation
    const taxRates: Record<string, number> = {
      'CA': 0.0875,
      'NY': 0.08,
      'TX': 0.0625,
      'FL': 0.06
    };

    const rate = taxRates[address.state] || 0.05;
    return subtotal * rate;
  }

  /**
   * Update inventory after order
   */
  private async updateInventory(items: Array<{ product_id: string; quantity: number }>): Promise<void> {
    for (const item of items) {
      await this.supabase
        .from('hardware_products')
        .update({
          inventory_count: this.supabase.raw(`inventory_count - ${item.quantity}`)
        })
        .eq('id', item.product_id);
    }
  }

  /**
   * Get popular hardware kits
   */
  async getPopularKits(): Promise<HardwareKit[]> {
    const { data, error } = await this.supabase
      .from('hardware_kits')
      .select('*')
      .eq('is_popular', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get kit recommendations for organization
   */
  async getKitRecommendations(organizationId: string, planType: string): Promise<HardwareKit[]> {
    const { data: org } = await this.supabase
      .from('organizations')
      .select('plan_type, settings')
      .eq('id', organizationId)
      .single();

    if (!org) return [];

    // Get kits based on plan type and organization needs
    const { data: kits } = await this.supabase
      .from('hardware_kits')
      .select('*')
      .eq('target_audience', planType)
      .order('is_popular', { ascending: false });

    return kits || [];
  }

  /**
   * Generate order summary
   */
  async generateOrderSummary(orderId: string): Promise<{
    order: HardwareOrder;
    products: HardwareProduct[];
    estimated_delivery: string;
    tracking_info?: string;
  }> {
    const { data: order } = await this.supabase
      .from('hardware_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) throw new Error('Order not found');

    const productIds = order.items.map(item => item.product_id);
    const { data: products } = await this.supabase
      .from('hardware_products')
      .select('*')
      .in('id', productIds);

    const estimated_delivery = this.calculateEstimatedDelivery(order.shipping_address);

    return {
      order,
      products: products || [],
      estimated_delivery,
      tracking_info: order.tracking_number
    };
  }

  /**
   * Calculate estimated delivery
   */
  private calculateEstimatedDelivery(address: any): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (address.country === 'US' ? 3 : 7));
    return deliveryDate.toISOString();
  }

  /**
   * Get hardware analytics
   */
  async getHardwareAnalytics(): Promise<{
    total_orders: number;
    total_revenue: number;
    top_products: Array<{ product_id: string; name: string; quantity_sold: number; revenue: number }>;
    inventory_alerts: number;
  }> {
    const { data: orders } = await this.supabase
      .from('hardware_orders')
      .select('items, total, status')
      .eq('status', 'delivered');

    const total_orders = orders?.length || 0;
    const total_revenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

    // Calculate top products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    orders?.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.product_id) || { name: '', quantity: 0, revenue: 0 };
        productSales.set(item.product_id, {
          name: existing.name,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.total_price
        });
      });
    });

    const top_products = Array.from(productSales.entries())
      .map(([product_id, data]) => ({ product_id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const inventoryStatus = await this.getInventoryStatus();
    const inventory_alerts = inventoryStatus.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;

    return {
      total_orders,
      total_revenue,
      top_products,
      inventory_alerts
    };
  }
}

export default HardwareStoreService;
