import { db } from '@/lib/db';

export type Variant = 'control' | 'variant_a' | 'variant_b';

export interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  weights: number[];
}

const EXPERIMENTS: Record<string, Experiment> = {
  button_color: {
    id: 'button_color',
    name: 'Button Color Test',
    variants: ['control', 'variant_a', 'variant_b'],
    weights: [0.34, 0.33, 0.33],
  },
  reward_pacing: {
    id: 'reward_pacing',
    name: 'Reward Pacing Test',
    variants: ['control', 'variant_a'],
    weights: [0.5, 0.5],
  },
};

export function assignVariant(experimentId: string, userId: string): Variant {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) return 'control';

  const hash = simpleHash(`${experimentId}-${userId}`);
  const normalized = (hash % 100) / 100;

  let cumulative = 0;
  for (let i = 0; i < experiment.weights.length; i++) {
    cumulative += experiment.weights[i];
    if (normalized < cumulative) return experiment.variants[i];
  }

  return 'control';
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function getVariant(userId: string, experimentId: string): Promise<Variant> {
  const existing = await db.userExperiment.findUnique({
    where: { userId_experimentId: { userId, experimentId } },
  });

  if (existing) return existing.variant as Variant;

  const variant = assignVariant(experimentId, userId);

  await db.userExperiment.create({
    data: { userId, experimentId, variant },
  });

  return variant;
}

export function getExperiments(): Experiment[] {
  return Object.values(EXPERIMENTS);
}
