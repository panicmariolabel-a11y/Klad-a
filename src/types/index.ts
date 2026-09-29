export type GameMode = 'kvota2' | 'ludilo25' | 'variable';

export type ScreenView = 'hub' | 'mode_ludilo' | 'mode_kvota2' | 'mode_variable';

export type HeroId = 'hero-1' | 'hero-2' | 'hero-3';

export interface Hero {
  id: HeroId;
  name: string;
  title: string;
  avatar: string;
  theme: {
    primary: string;
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  steps: number[]; // [100, 300, 1000, 3000, 9000]
  currentStepIndex: number; // 0 to 4
  status: 'active' | 'down' | 'recovering';
  totalAccumulatedDebt: number; // e.g. 13400 if 9000 fails
  stats: {
    wins: number;
    losses: number;
    totalStaked: number;
    totalWon: number;
    netProfit: number;
    consecutiveLosses: number;
  };
}

export interface RescueState {
  activeHeroId: HeroId | null;
  queue: HeroId[];
  targetDebt: number; // Total debt being rescued (e.g. 13,000 or 13,400)
  recoveredAmount: number; // Amount recovered so far
  accumulatedRescueSpent: number; // Money spent by rescue hero in the current rescue mission
  attemptNumber: number;
  lastOutcome: 'win' | 'loss' | null;
  history: {
    attempt: number;
    stake: number;
    recovered: number;
    result: 'win' | 'loss';
    spentBefore: number;
  }[];
}

// Mode 2: Ludilo 7+ i Prelazi (Kvota 25+)
export interface LudiloHero {
  id: HeroId;
  name: string;
  specialty: '7+' | '2u1' | '1u2' | 'ludilo';
  title: string;
  avatar: string;
  currentAttempt: number; // 1 to 75
  maxAttempts: number; // 75
  defaultOdd: number; // 25.0+
  currentOdd: number;
  totalLostInCycle: number;
  targetProfitAboveDebt: number; // e.g. 500 or 1000 RSD
  stats: {
    wins: number;
    losses: number;
    totalStaked: number;
    totalWon: number;
    netProfit: number;
    highestHit: number;
  };
}

// Mode 3: Varijabilni Ulozi i Kvote (Ciljani Profit)
export interface VariableHero {
  id: HeroId;
  name: string;
  title: string;
  avatar: string;
  targetProfit: number; // 1000, 5000, 10000 or custom
  currentOdd: number; // e.g. 2.10
  totalLostInCycle: number;
  cycleAttempts: number;
  stats: {
    wins: number;
    losses: number;
    totalStaked: number;
    totalWon: number;
    netProfit: number;
    completedCycles: number;
  };
}

export interface TicketLog {
  id: string;
  timestamp: number;
  mode: GameMode;
  source: HeroId | 'rescue';
  heroName: string;
  stepDescription: string;
  stake: number;
  odd: number;
  potentialReturn: number;
  result: 'win' | 'loss';
  netProfit: number;
  note?: string;
}

export interface AppConfig {
  soundEnabled: boolean;
  baseDebtChoice: 13000 | 13400;
  rescueFormula: 'user_exact' | 'strict_covering';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string; // e.g. 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose'
  createdAt: number;
  password?: string; // Optional password/PIN to lock and protect game data
  isPasswordProtected?: boolean;
  bankroll: {
    initial: number;
    current: number;
  };
  heroes: Hero[];
  rescueState: RescueState;
  ludiloHeroes: LudiloHero[];
  variableHeroes: VariableHero[];
  logs: TicketLog[];
}
