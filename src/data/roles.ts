export type RoleId = 'driver' | 'logistics_company' | 'field_officer' | 'authority_admin';

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  icon: string; // We will use Lucide React icons
}

export const ROLES: Role[] = [
  {
    id: 'driver',
    name: 'Driver',
    description: 'Manage trips, routes and delivery status.',
    icon: 'Truck'
  },
  {
    id: 'logistics_company',
    name: 'Logistics Company',
    description: 'Monitor your fleet and logistics operations.',
    icon: 'Building2'
  },
  {
    id: 'field_officer',
    name: 'Field Officer',
    description: 'Report incidents and road conditions from the field.',
    icon: 'MapPin'
  },
  {
    id: 'authority_admin',
    name: 'Authority / Admin',
    description: 'Monitor regional logistics and accessibility.',
    icon: 'ShieldCheck'
  }
];
