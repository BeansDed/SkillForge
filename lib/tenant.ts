import { db } from '@/lib/db';
import { headers } from 'next/headers';

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
  };
  featureFlags: {
    store: boolean;
    social: boolean;
    aiTools: boolean;
    leaderboards: boolean;
  };
}

const DEFAULT_THEME = {
  primaryColor: '#6366F1',
  backgroundColor: '#0F172A',
  surfaceColor: '#1E293B',
};

const DEFAULT_FLAGS = {
  store: true,
  social: true,
  aiTools: false,
  leaderboards: true,
};

export async function getTenantFromDomain(): Promise<TenantConfig | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const domain = host.split(':')[0];

  if (domain === 'localhost' || domain === '127.0.0.1') {
    return getDefaultTenant();
  }

  const tenant = await db.tenant.findUnique({ where: { domain } });
  if (!tenant) return null;

  return {
    id: tenant.id,
    name: tenant.name,
    domain: tenant.domain,
    theme: (tenant.theme as TenantConfig['theme']) || DEFAULT_THEME,
    featureFlags: (tenant.featureFlags as TenantConfig['featureFlags']) || DEFAULT_FLAGS,
  };
}

export function getDefaultTenant(): TenantConfig {
  return {
    id: 'default',
    name: 'SkillForge',
    domain: 'localhost',
    theme: DEFAULT_THEME,
    featureFlags: DEFAULT_FLAGS,
  };
}

export function isFeatureEnabled(tenant: TenantConfig, feature: keyof TenantConfig['featureFlags']): boolean {
  return tenant.featureFlags[feature] ?? false;
}
