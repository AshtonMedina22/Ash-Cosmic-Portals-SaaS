/**
 * Enterprise Internal Use Cases for Cosmic Portals
 * HR onboarding, staff recognition, ID badges, internal portals
 */

import { createClient } from '../supabase/client';

export interface Employee {
  id: string;
  organization_id: string;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
  nfc_badge_id?: string;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface Recognition {
  id: string;
  organization_id: string;
  employee_id: string;
  recognition_type: 'achievement' | 'milestone' | 'peer_nomination' | 'leadership';
  title: string;
  description: string;
  awarded_by: string;
  points: number;
  is_public: boolean;
  created_at: string;
}

export interface OnboardingTask {
  id: string;
  organization_id: string;
  employee_id: string;
  task_name: string;
  description: string;
  category: 'hr' | 'it' | 'security' | 'training' | 'facilities';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completed_at?: string;
  assigned_to: string;
  created_at: string;
}

export interface InternalPortal {
  id: string;
  organization_id: string;
  portal_type: 'hr' | 'it' | 'security' | 'facilities' | 'training';
  name: string;
  description: string;
  url: string;
  access_level: 'all' | 'department' | 'role' | 'custom';
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

export class EnterpriseService {
  private supabase = createClient();

  /**
   * Employee Management
   */
  async createEmployee(data: {
    organization_id: string;
    employee_id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    hire_date: string;
    nfc_badge_id?: string;
  }): Promise<Employee> {
    const { data: employee, error } = await this.supabase
      .from('employees')
      .insert({
        organization_id: data.organization_id,
        employee_id: data.employee_id,
        name: data.name,
        email: data.email,
        department: data.department,
        position: data.position,
        hire_date: data.hire_date,
        nfc_badge_id: data.nfc_badge_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return employee;
  }

  async getEmployees(organizationId: string): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<Employee> {
    const { data, error } = await this.supabase
      .from('employees')
      .update(updates)
      .eq('id', employeeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * NFC Badge Management
   */
  async assignNFCBadge(employeeId: string, badgeId: string): Promise<Employee> {
    return this.updateEmployee(employeeId, { nfc_badge_id: badgeId });
  }

  async getEmployeeByBadge(badgeId: string): Promise<Employee | null> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('nfc_badge_id', badgeId)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Recognition System
   */
  async createRecognition(data: {
    organization_id: string;
    employee_id: string;
    recognition_type: string;
    title: string;
    description: string;
    awarded_by: string;
    points: number;
    is_public?: boolean;
  }): Promise<Recognition> {
    const { data: recognition, error } = await this.supabase
      .from('recognitions')
      .insert({
        organization_id: data.organization_id,
        employee_id: data.employee_id,
        recognition_type: data.recognition_type,
        title: data.title,
        description: data.description,
        awarded_by: data.awarded_by,
        points: data.points,
        is_public: data.is_public || true
      })
      .select()
      .single();

    if (error) throw error;
    return recognition;
  }

  async getEmployeeRecognitions(employeeId: string): Promise<Recognition[]> {
    const { data, error } = await this.supabase
      .from('recognitions')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getOrganizationRecognitions(organizationId: string): Promise<Recognition[]> {
    const { data, error } = await this.supabase
      .from('recognitions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Onboarding System
   */
  async createOnboardingTask(data: {
    organization_id: string;
    employee_id: string;
    task_name: string;
    description: string;
    category: string;
    due_date: string;
    assigned_to: string;
  }): Promise<OnboardingTask> {
    const { data: task, error } = await this.supabase
      .from('onboarding_tasks')
      .insert({
        organization_id: data.organization_id,
        employee_id: data.employee_id,
        task_name: data.task_name,
        description: data.description,
        category: data.category,
        status: 'pending',
        due_date: data.due_date,
        assigned_to: data.assigned_to
      })
      .select()
      .single();

    if (error) throw error;
    return task;
  }

  async getEmployeeOnboardingTasks(employeeId: string): Promise<OnboardingTask[]> {
    const { data, error } = await this.supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('employee_id', employeeId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async completeOnboardingTask(taskId: string): Promise<OnboardingTask> {
    const { data, error } = await this.supabase
      .from('onboarding_tasks')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Internal Portal Management
   */
  async createInternalPortal(data: {
    organization_id: string;
    portal_type: string;
    name: string;
    description: string;
    url: string;
    access_level: string;
    permissions: string[];
  }): Promise<InternalPortal> {
    const { data: portal, error } = await this.supabase
      .from('internal_portals')
      .insert({
        organization_id: data.organization_id,
        portal_type: data.portal_type,
        name: data.name,
        description: data.description,
        url: data.url,
        access_level: data.access_level,
        permissions: data.permissions,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return portal;
  }

  async getInternalPortals(organizationId: string): Promise<InternalPortal[]> {
    const { data, error } = await this.supabase
      .from('internal_portals')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Access Control
   */
  async checkPortalAccess(employeeId: string, portalId: string): Promise<boolean> {
    const { data: employee } = await this.supabase
      .from('employees')
      .select('department, position')
      .eq('id', employeeId)
      .single();

    const { data: portal } = await this.supabase
      .from('internal_portals')
      .select('access_level, permissions')
      .eq('id', portalId)
      .single();

    if (!employee || !portal) return false;

    // Check access level
    switch (portal.access_level) {
      case 'all':
        return true;
      case 'department':
        return portal.permissions.includes(employee.department);
      case 'role':
        return portal.permissions.includes(employee.position);
      case 'custom':
        // Custom logic would go here
        return false;
      default:
        return false;
    }
  }

  /**
   * Analytics for Internal Use
   */
  async getEmployeeEngagementMetrics(organizationId: string): Promise<{
    total_employees: number;
    active_employees: number;
    recognition_count: number;
    onboarding_completion_rate: number;
    portal_usage: Record<string, number>;
  }> {
    const [
      { count: totalEmployees },
      { count: activeEmployees },
      { count: recognitions },
      { data: onboardingTasks }
    ] = await Promise.all([
      this.supabase.from('employees').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
      this.supabase.from('employees').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId).eq('status', 'active'),
      this.supabase.from('recognitions').select('*', { count: 'exact', head: true }).eq('organization_id', organizationId),
      this.supabase.from('onboarding_tasks').select('*').eq('organization_id', organizationId)
    ]);

    const completedTasks = onboardingTasks?.filter(task => task.status === 'completed').length || 0;
    const totalTasks = onboardingTasks?.length || 0;
    const onboarding_completion_rate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      total_employees: totalEmployees || 0,
      active_employees: activeEmployees || 0,
      recognition_count: recognitions || 0,
      onboarding_completion_rate,
      portal_usage: {} // TODO: Implement portal usage tracking
    };
  }

  /**
   * Generate Employee Dashboard Data
   */
  async getEmployeeDashboard(employeeId: string): Promise<{
    employee: Employee;
    recognitions: Recognition[];
    onboarding_tasks: OnboardingTask[];
    available_portals: InternalPortal[];
    recent_activity: any[];
  }> {
    const [employee, recognitions, onboardingTasks, portals] = await Promise.all([
      this.supabase.from('employees').select('*').eq('id', employeeId).single(),
      this.getEmployeeRecognitions(employeeId),
      this.getEmployeeOnboardingTasks(employeeId),
      this.getInternalPortals(employeeId) // This would need to be filtered by employee access
    ]);

    return {
      employee: employee.data,
      recognitions,
      onboarding_tasks: onboardingTasks,
      available_portals: portals,
      recent_activity: [] // TODO: Implement activity tracking
    };
  }
}

export default EnterpriseService;
