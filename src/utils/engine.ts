import { Hero, HeroId, RescueState, AppConfig, LudiloHero, VariableHero } from '../types';

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'hero-1',
    name: 'Vukadin',
    title: 'Gvozdeni Vitez (Iron Valor)',
    avatar: '/images/hero_iron_knight_1790685923125.jpg',
    theme: {
      primary: 'from-amber-500 to-yellow-600',
      border: 'border-amber-500/40 hover:border-amber-400',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      badgeText: 'text-amber-400',
      accent: 'amber',
    },
    steps: [100, 300, 1000, 3000, 9000],
    currentStepIndex: 0,
    status: 'active',
    totalAccumulatedDebt: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      consecutiveLosses: 0,
    },
  },
  {
    id: 'hero-2',
    name: 'Senka',
    title: 'Fantomska Noć (Shadow Striker)',
    avatar: '/images/hero_shadow_archer_1790685938643.jpg',
    theme: {
      primary: 'from-purple-600 to-indigo-700',
      border: 'border-purple-500/40 hover:border-purple-400',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      badgeText: 'text-purple-400',
      accent: 'purple',
    },
    steps: [100, 300, 1000, 3000, 9000],
    currentStepIndex: 0,
    status: 'active',
    totalAccumulatedDebt: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      consecutiveLosses: 0,
    },
  },
  {
    id: 'hero-3',
    name: 'Gromovnik',
    title: 'Gospodar Oluje (Storm Sovereign)',
    avatar: '/images/hero_storm_mage_1790685953183.jpg',
    theme: {
      primary: 'from-cyan-500 to-blue-600',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      badgeText: 'text-cyan-400',
      accent: 'cyan',
    },
    steps: [100, 300, 1000, 3000, 9000],
    currentStepIndex: 0,
    status: 'active',
    totalAccumulatedDebt: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      consecutiveLosses: 0,
    },
  },
];

export const INITIAL_RESCUE_STATE: RescueState = {
  activeHeroId: null,
  queue: [],
  targetDebt: 13000,
  recoveredAmount: 0,
  accumulatedRescueSpent: 0,
  attemptNumber: 1,
  lastOutcome: null,
  history: [],
};

// Mode 2: Ludilo 7+ i Prelazi (Kvota 25+)
export const INITIAL_LUDILO_HEROES: LudiloHero[] = [
  {
    id: 'hero-1',
    name: 'Vukadin Golgeter',
    specialty: '7+',
    title: 'Specijalista za 7+ Golova',
    avatar: '/images/hero_iron_knight_1790685923125.jpg',
    currentAttempt: 1,
    maxAttempts: 75,
    defaultOdd: 25.0,
    currentOdd: 25.0,
    totalLostInCycle: 0,
    targetProfitAboveDebt: 500,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      highestHit: 0,
    },
  },
  {
    id: 'hero-2',
    name: 'Senka Preokret (2 u 1)',
    specialty: '2u1',
    title: 'Lovac na prelaz iz 2 u 1',
    avatar: '/images/hero_shadow_archer_1790685938643.jpg',
    currentAttempt: 1,
    maxAttempts: 75,
    defaultOdd: 28.0,
    currentOdd: 28.0,
    totalLostInCycle: 0,
    targetProfitAboveDebt: 500,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      highestHit: 0,
    },
  },
  {
    id: 'hero-3',
    name: 'Gromovnik Preokret (1 u 2)',
    specialty: '1u2',
    title: 'Lovac na prelaz iz 1 u 2',
    avatar: '/images/hero_storm_mage_1790685953183.jpg',
    currentAttempt: 1,
    maxAttempts: 75,
    defaultOdd: 28.0,
    currentOdd: 28.0,
    totalLostInCycle: 0,
    targetProfitAboveDebt: 500,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      highestHit: 0,
    },
  },
];

// Mode 3: Varijabilni Ulozi i Kvote
export const INITIAL_VARIABLE_HEROES: VariableHero[] = [
  {
    id: 'hero-1',
    name: 'Vukadin Profit',
    title: 'Strategija Ciljanog Profita 1.000 RSD',
    avatar: '/images/hero_iron_knight_1790685923125.jpg',
    targetProfit: 1000,
    currentOdd: 2.10,
    totalLostInCycle: 0,
    cycleAttempts: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      completedCycles: 0,
    },
  },
  {
    id: 'hero-2',
    name: 'Senka Snajper',
    title: 'Strategija Ciljanog Profita 5.000 RSD',
    avatar: '/images/hero_shadow_archer_1790685938643.jpg',
    targetProfit: 5000,
    currentOdd: 2.50,
    totalLostInCycle: 0,
    cycleAttempts: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      completedCycles: 0,
    },
  },
  {
    id: 'hero-3',
    name: 'Gromovnik Titan',
    title: 'Strategija Ciljanog Profita 10.000 RSD',
    avatar: '/images/hero_storm_mage_1790685953183.jpg',
    targetProfit: 10000,
    currentOdd: 2.00,
    totalLostInCycle: 0,
    cycleAttempts: 0,
    stats: {
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0,
      netProfit: 0,
      completedCycles: 0,
    },
  },
];

export const INITIAL_CONFIG: AppConfig = {
  soundEnabled: true,
  baseDebtChoice: 13000,
  rescueFormula: 'user_exact',
};

/**
 * Calculates the exact recommended stake for the Rescue Hero (Mode 1)
 */
export function calculateRescueStake(
  rescueState: RescueState,
  config: AppConfig
): {
  stake: number;
  explanation: string;
  targetChunk: number;
  percentageGoal: number;
} {
  const remainingDebt = Math.max(0, rescueState.targetDebt - rescueState.recoveredAmount);

  if (rescueState.accumulatedRescueSpent === 0 || rescueState.lastOutcome === 'win') {
    const goalPct = 50;
    const targetChunk = Math.min(remainingDebt, Math.round(rescueState.targetDebt * 0.5));
    const stake = Math.max(100, targetChunk);

    return {
      stake,
      explanation: `Prvi udar (50% duga): Cilj je vratiti ${targetChunk.toLocaleString('sr-RS')} RSD (50% od ${rescueState.targetDebt.toLocaleString('sr-RS')} RSD).`,
      targetChunk,
      percentageGoal: goalPct,
    };
  }

  const debt25 = Math.round(rescueState.targetDebt * 0.25);
  const spent = rescueState.accumulatedRescueSpent;

  if (config.rescueFormula === 'user_exact') {
    const spent25 = Math.round(spent * 0.25);
    const stake = spent + spent25 + debt25;
    return {
      stake,
      explanation: `Oporavak po formuli: Ceo dosadašnji ulog spasitelja (${spent.toLocaleString('sr-RS')} RSD) + 25% budžeta spasitelja (${spent25.toLocaleString('sr-RS')} RSD) + 25% duga heroja (${debt25.toLocaleString('sr-RS')} RSD).`,
      targetChunk: debt25,
      percentageGoal: 25,
    };
  } else {
    const stake = spent + debt25;
    return {
      stake,
      explanation: `Oporavak uloga: Pokrivanje dosadašnjeg uloga spasitelja (${spent.toLocaleString('sr-RS')} RSD) + 25% duga heroja (${debt25.toLocaleString('sr-RS')} RSD).`,
      targetChunk: debt25,
      percentageGoal: 25,
    };
  }
}

/**
 * Mode 2: Ludilo 7+ i Prelazi (Kvota 25+)
 * Steps 1 to 20: 100 RSD
 * Steps 21 to 75: Progressive stake to recover all lost so far + target profit
 */
export function calculateLudiloStake(hero: LudiloHero, odd: number): {
  stake: number;
  explanation: string;
  isFirstPhase: boolean;
  potentialNetProfit: number;
} {
  const safeOdd = Math.max(2.0, odd);
  if (hero.currentAttempt <= 20) {
    const stake = 100;
    const potentialReturn = Math.round(stake * safeOdd);
    const totalLostWithThis = hero.totalLostInCycle + stake;
    const net = potentialReturn - totalLostWithThis;
    return {
      stake,
      explanation: `Faza 1 (Pokušaj ${hero.currentAttempt}/20): Fiksni ulog 100 RSD. Uloženo u nizu do sada: ${hero.totalLostInCycle.toLocaleString('sr-RS')} RSD.`,
      isFirstPhase: true,
      potentialNetProfit: net,
    };
  }

  // Phase 2: Attempts 21 to 75
  const targetProfit = hero.targetProfitAboveDebt || 500;
  const oddEff = safeOdd - 1;
  const rawStake = Math.ceil((hero.totalLostInCycle + targetProfit) / oddEff);
  // Round to nearest 10 dinars
  const stake = Math.max(100, Math.ceil(rawStake / 10) * 10);
  const potentialReturn = Math.round(stake * safeOdd);
  const totalLostWithThis = hero.totalLostInCycle + stake;
  const net = potentialReturn - totalLostWithThis;

  return {
    stake,
    explanation: `Faza 2 (Pokušaj ${hero.currentAttempt}/75): Ulog od ${stake.toLocaleString('sr-RS')} RSD na kvotu ${safeOdd.toFixed(1)} pokriva sve izgubljeno (${hero.totalLostInCycle.toLocaleString('sr-RS')} RSD) i ostvaruje čistu zaradu od +${net.toLocaleString('sr-RS')} RSD!`,
    isFirstPhase: false,
    potentialNetProfit: net,
  };
}

/**
 * Mode 3: Varijabilni Ulozi i Kvote (Ciljani Profit)
 * Ulog = (Prethodno_Uloženo + Željeni_Profit) / (Kvota - 1)
 */
export function calculateVariableStake(
  hero: VariableHero,
  odd: number,
  targetProfit: number
): {
  stake: number;
  explanation: string;
  potentialNetProfit: number;
  potentialGrossReturn: number;
} {
  const safeOdd = Math.max(1.1, odd);
  const oddEff = safeOdd - 1;
  const rawStake = Math.ceil((hero.totalLostInCycle + targetProfit) / oddEff);
  const stake = Math.max(50, Math.ceil(rawStake / 10) * 10);
  const potentialGrossReturn = Math.round(stake * safeOdd);
  const potentialNetProfit = potentialGrossReturn - (hero.totalLostInCycle + stake);

  return {
    stake,
    explanation: `Računar je sabrao prethodne uloge (${hero.totalLostInCycle.toLocaleString('sr-RS')} RSD) + željeni profit (${targetProfit.toLocaleString('sr-RS')} RSD) na kvotu ${safeOdd.toFixed(2)}.`,
    potentialNetProfit,
    potentialGrossReturn,
  };
}
