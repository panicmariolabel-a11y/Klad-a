/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Hero,
  HeroId,
  RescueState,
  TicketLog,
  AppConfig,
  GameMode,
  ScreenView,
  LudiloHero,
  VariableHero,
  UserProfile,
} from './types';
import {
  INITIAL_HEROES,
  INITIAL_RESCUE_STATE,
  INITIAL_LUDILO_HEROES,
  INITIAL_VARIABLE_HEROES,
  calculateRescueStake,
  calculateLudiloStake,
  calculateVariableStake,
} from './utils/engine';
import {
  loadProfiles,
  saveProfiles,
  loadAppConfig,
  saveAppConfig,
  createDefaultProfile,
} from './utils/storage';
import { sounds } from './utils/audio';

import { Header } from './components/Header';
import { ModeNavBar } from './components/ModeNavBar';
import { HomeHub } from './components/HomeHub';
import { BankrollSummary } from './components/BankrollSummary';
import { HeroCard } from './components/HeroCard';
import { RescueHeroCard } from './components/RescueHeroCard';
import { LudiloCard } from './components/LudiloCard';
import { VariableHeroCard } from './components/VariableHeroCard';
import { HistoryTable } from './components/HistoryTable';
import { RulesModal } from './components/RulesModal';
import { SimulationModal } from './components/SimulationModal';
import { ReviveCelebration } from './components/ReviveCelebration';
import { ProfileModal } from './components/ProfileModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ShareAppModal } from './components/ShareAppModal';
import { HeroWinCelebration, WinCelebrationData } from './components/HeroWinCelebration';
import { ProfilePasswordModal } from './components/ProfilePasswordModal';

export default function App() {
  // Profiles Management
  const [profileData, setProfileData] = useState(() => loadProfiles());
  const [profiles, setProfiles] = useState<UserProfile[]>(() => profileData.profiles);
  const [activeProfileId, setActiveProfileId] = useState<string>(() => profileData.activeId);

  // Screen View: 'hub' (Home Screen) or specific mode
  const [currentView, setCurrentView] = useState<ScreenView>('hub');

  // Global Config
  const [config, setConfig] = useState<AppConfig>(() => loadAppConfig());

  // Modals & Celebrations
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const [isProfilesOpen, setIsProfilesOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [revivedHero, setRevivedHero] = useState<Hero | null>(null);
  const [winCelebrationData, setWinCelebrationData] = useState<WinCelebrationData | null>(null);
  const [pendingUnlockProfile, setPendingUnlockProfile] = useState<UserProfile | null>(null);

  // Active Profile reference
  const activeProfile: UserProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || createDefaultProfile();

  // Sync sounds
  useEffect(() => {
    sounds.enabled = config.soundEnabled;
    saveAppConfig(config);
  }, [config]);

  // Persist profiles on changes
  useEffect(() => {
    saveProfiles(profiles, activeProfileId);
  }, [profiles, activeProfileId]);

  // Update active profile helper
  const updateActiveProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? updater(p) : p))
    );
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316'],
      });
    } catch {
      // ignore
    }
  };

  // Convert currentView to GameMode
  const activeGameMode: GameMode | null =
    currentView === 'mode_ludilo'
      ? 'ludilo25'
      : currentView === 'mode_kvota2'
      ? 'kvota2'
      : currentView === 'mode_variable'
      ? 'variable'
      : null;

  /* =====================================================================
     PROFILE ACTIONS
  ===================================================================== */
  const handleSelectProfile = (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (!target) return;

    // If target profile has a password and is not already active, prompt for password
    if (target.password && target.id !== activeProfileId) {
      setPendingUnlockProfile(target);
    } else {
      setActiveProfileId(id);
      setIsProfilesOpen(false);
      sounds.playClick();
    }
  };

  const handleUnlockSuccess = () => {
    if (pendingUnlockProfile) {
      setActiveProfileId(pendingUnlockProfile.id);
      setPendingUnlockProfile(null);
      setIsProfilesOpen(false);
    }
  };

  const handleUpdateProfilePassword = (profileId: string, newPassword?: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? {
              ...p,
              password: newPassword,
              isPasswordProtected: !!newPassword,
            }
          : p
      )
    );
  };

  const handleCreateProfile = (newProfile: UserProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setIsProfilesOpen(false);
    sounds.playClick();
    triggerConfetti();
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      setActiveProfileId(remaining[0].id);
    }
    sounds.playClick();
  };

  /* =====================================================================
     SAFE RESET ACTIONS (Mode vs Entire Profile)
  ===================================================================== */
  const handleResetMode = (mode: GameMode) => {
    updateActiveProfile((prof) => {
      if (mode === 'ludilo25') {
        return {
          ...prof,
          ludiloHeroes: INITIAL_LUDILO_HEROES,
        };
      } else if (mode === 'kvota2') {
        return {
          ...prof,
          heroes: INITIAL_HEROES,
          rescueState: INITIAL_RESCUE_STATE,
        };
      } else if (mode === 'variable') {
        return {
          ...prof,
          variableHeroes: INITIAL_VARIABLE_HEROES,
        };
      }
      return prof;
    });
    sounds.playClick();
  };

  const handleResetEntireProfile = () => {
    updateActiveProfile((prof) => ({
      ...prof,
      bankroll: { initial: prof.bankroll.initial, current: prof.bankroll.initial },
      heroes: INITIAL_HEROES,
      rescueState: INITIAL_RESCUE_STATE,
      ludiloHeroes: INITIAL_LUDILO_HEROES,
      variableHeroes: INITIAL_VARIABLE_HEROES,
      logs: [],
    }));
    sounds.playClick();
  };

  /* =====================================================================
     MODE 1: KVOTA 2.0 HANDLERS
  ===================================================================== */
  const handleHeroWin = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.heroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.heroes[heroIndex];
    const currentStep = hero.currentStepIndex;
    const stake = hero.steps[currentStep];
    const grossReturn = Math.round(stake * odd);
    const netProfit = grossReturn - stake;

    sounds.playWin();
    triggerConfetti();

    setWinCelebrationData({
      heroName: hero.name,
      heroAvatar: hero.avatar,
      heroTitle: hero.title,
      modeName: 'Kvota 2.0 Sistem',
      stake,
      odd,
      grossReturn,
      netProfit,
    });

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'kvota2',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Korak ${currentStep + 1} (${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: grossReturn,
      result: 'win',
      netProfit,
      note,
    };

    const updatedHero: Hero = {
      ...hero,
      currentStepIndex: 0,
      status: 'active',
      stats: {
        ...hero.stats,
        wins: hero.stats.wins + 1,
        totalStaked: hero.stats.totalStaked + stake,
        totalWon: hero.stats.totalWon + grossReturn,
        netProfit: hero.stats.netProfit + netProfit,
        consecutiveLosses: 0,
      },
    };

    updateActiveProfile((prof) => {
      const newHeroes = [...prof.heroes];
      newHeroes[heroIndex] = updatedHero;
      return {
        ...prof,
        heroes: newHeroes,
        logs: [newLog, ...prof.logs],
        bankroll: { ...prof.bankroll, current: prof.bankroll.current + netProfit },
      };
    });
  };

  const handleHeroLoss = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.heroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.heroes[heroIndex];
    const currentStep = hero.currentStepIndex;
    const stake = hero.steps[currentStep];

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'kvota2',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Korak ${currentStep + 1} (${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: 0,
      result: 'loss',
      netProfit: -stake,
      note,
    };

    updateActiveProfile((prof) => {
      const newBankroll = { ...prof.bankroll, current: prof.bankroll.current - stake };
      const newLogs = [newLog, ...prof.logs];

      if (currentStep < 4) {
        sounds.playLoss();
        const updatedHero: Hero = {
          ...hero,
          currentStepIndex: currentStep + 1,
          stats: {
            ...hero.stats,
            losses: hero.stats.losses + 1,
            totalStaked: hero.stats.totalStaked + stake,
            netProfit: hero.stats.netProfit - stake,
            consecutiveLosses: hero.stats.consecutiveLosses + 1,
          },
        };
        const newHeroes = [...prof.heroes];
        newHeroes[heroIndex] = updatedHero;
        return { ...prof, heroes: newHeroes, logs: newLogs, bankroll: newBankroll };
      } else {
        sounds.playRescueAlert();
        const updatedHero: Hero = {
          ...hero,
          status: 'down',
          totalAccumulatedDebt: config.baseDebtChoice,
          stats: {
            ...hero.stats,
            losses: hero.stats.losses + 1,
            totalStaked: hero.stats.totalStaked + stake,
            netProfit: hero.stats.netProfit - stake,
            consecutiveLosses: hero.stats.consecutiveLosses + 1,
          },
        };
        const newHeroes = [...prof.heroes];
        newHeroes[heroIndex] = updatedHero;

        const newRescueState: RescueState = !prof.rescueState.activeHeroId
          ? {
              activeHeroId: hero.id,
              queue: [],
              targetDebt: config.baseDebtChoice,
              recoveredAmount: 0,
              accumulatedRescueSpent: 0,
              attemptNumber: 1,
              lastOutcome: null,
              history: [],
            }
          : {
              ...prof.rescueState,
              queue: [...prof.rescueState.queue, hero.id],
            };

        return { ...prof, heroes: newHeroes, rescueState: newRescueState, logs: newLogs, bankroll: newBankroll };
      }
    });
  };

  const handleRescueWin = (odd: number, note: string) => {
    if (!activeProfile.rescueState.activeHeroId) return;
    const activeHero = activeProfile.heroes.find((h) => h.id === activeProfile.rescueState.activeHeroId);
    if (!activeHero) return;

    const calc = calculateRescueStake(activeProfile.rescueState, config);
    const stake = calc.stake;
    const grossReturn = Math.round(stake * odd);
    const netProfit = grossReturn - stake;

    sounds.playWin();

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'kvota2',
      source: 'rescue',
      heroName: `Feniks (Spasavanje: ${activeHero.name})`,
      stepDescription: `Pokušaj #${activeProfile.rescueState.attemptNumber} (Ulog: ${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: grossReturn,
      result: 'win',
      netProfit,
      note,
    };

    const newlyRecovered = activeProfile.rescueState.recoveredAmount + calc.targetChunk;

    setWinCelebrationData({
      heroName: 'Feniks Spasitelj',
      heroAvatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
      heroTitle: `Spasavanje za heroja ${activeHero.name}`,
      modeName: 'Kvota 2.0 (Spasavanje duga)',
      stake,
      odd,
      grossReturn,
      netProfit,
    });

    updateActiveProfile((prof) => {
      const newBankroll = { ...prof.bankroll, current: prof.bankroll.current + netProfit };
      const newLogs = [newLog, ...prof.logs];

      if (newlyRecovered >= prof.rescueState.targetDebt) {
        sounds.playRevive();
        triggerConfetti();
        setRevivedHero(activeHero);

        const newHeroes = prof.heroes.map((h) =>
          h.id === activeHero.id
            ? { ...h, status: 'active' as const, currentStepIndex: 0, totalAccumulatedDebt: 0 }
            : h
        );

        let nextRescue: RescueState = { ...INITIAL_RESCUE_STATE };
        if (prof.rescueState.queue.length > 0) {
          nextRescue = {
            activeHeroId: prof.rescueState.queue[0],
            queue: prof.rescueState.queue.slice(1),
            targetDebt: config.baseDebtChoice,
            recoveredAmount: 0,
            accumulatedRescueSpent: 0,
            attemptNumber: 1,
            lastOutcome: null,
            history: [],
          };
        }

        return { ...prof, heroes: newHeroes, rescueState: nextRescue, logs: newLogs, bankroll: newBankroll };
      } else {
        return {
          ...prof,
          rescueState: {
            ...prof.rescueState,
            recoveredAmount: newlyRecovered,
            accumulatedRescueSpent: 0,
            attemptNumber: prof.rescueState.attemptNumber + 1,
            lastOutcome: 'win',
          },
          logs: newLogs,
          bankroll: newBankroll,
        };
      }
    });
  };

  const handleRescueLoss = (odd: number, note: string) => {
    if (!activeProfile.rescueState.activeHeroId) return;
    const activeHero = activeProfile.heroes.find((h) => h.id === activeProfile.rescueState.activeHeroId);
    if (!activeHero) return;

    const calc = calculateRescueStake(activeProfile.rescueState, config);
    const stake = calc.stake;

    sounds.playLoss();

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'kvota2',
      source: 'rescue',
      heroName: `Feniks (Spasavanje: ${activeHero.name})`,
      stepDescription: `Pokušaj #${activeProfile.rescueState.attemptNumber} (Ulog: ${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: 0,
      result: 'loss',
      netProfit: -stake,
      note,
    };

    updateActiveProfile((prof) => ({
      ...prof,
      rescueState: {
        ...prof.rescueState,
        accumulatedRescueSpent: prof.rescueState.accumulatedRescueSpent + stake,
        attemptNumber: prof.rescueState.attemptNumber + 1,
        lastOutcome: 'loss',
      },
      logs: [newLog, ...prof.logs],
      bankroll: { ...prof.bankroll, current: prof.bankroll.current - stake },
    }));
  };

  const handleManualResetHero = (heroId: string) => {
    updateActiveProfile((prof) => ({
      ...prof,
      heroes: prof.heroes.map((h) =>
        h.id === heroId ? { ...h, currentStepIndex: 0, status: 'active' as const, totalAccumulatedDebt: 0 } : h
      ),
    }));
  };

  /* =====================================================================
     MODE 2: LUDILO 7+ & PRELAZI (KVOTA 25+) HANDLERS
  ===================================================================== */
  const handleLudiloWin = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.ludiloHeroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.ludiloHeroes[heroIndex];
    const calc = calculateLudiloStake(hero, odd);
    const stake = calc.stake;
    const grossReturn = Math.round(stake * odd);
    const netProfit = calc.potentialNetProfit > 0 ? calc.potentialNetProfit : grossReturn - stake;

    sounds.playWin();
    triggerConfetti();

    setWinCelebrationData({
      heroName: hero.name,
      heroAvatar: hero.avatar,
      heroTitle: hero.title,
      modeName: 'Ludilo 7+ & Prelazi',
      stake,
      odd,
      grossReturn,
      netProfit,
    });

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'ludilo25',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Pokušaj ${hero.currentAttempt}/75 (${stake.toLocaleString('sr-RS')} RSD @ ${odd.toFixed(1)})`,
      stake,
      odd,
      potentialReturn: grossReturn,
      result: 'win',
      netProfit,
      note,
    };

    const updatedHero: LudiloHero = {
      ...hero,
      currentAttempt: 1,
      totalLostInCycle: 0,
      stats: {
        ...hero.stats,
        wins: hero.stats.wins + 1,
        totalStaked: hero.stats.totalStaked + stake,
        totalWon: hero.stats.totalWon + grossReturn,
        netProfit: hero.stats.netProfit + netProfit,
        highestHit: Math.max(hero.stats.highestHit, grossReturn),
      },
    };

    updateActiveProfile((prof) => {
      const newLudilo = [...prof.ludiloHeroes];
      newLudilo[heroIndex] = updatedHero;
      return {
        ...prof,
        ludiloHeroes: newLudilo,
        logs: [newLog, ...prof.logs],
        bankroll: { ...prof.bankroll, current: prof.bankroll.current + netProfit },
      };
    });
  };

  const handleLudiloLoss = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.ludiloHeroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.ludiloHeroes[heroIndex];
    const calc = calculateLudiloStake(hero, odd);
    const stake = calc.stake;

    sounds.playLoss();

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'ludilo25',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Pokušaj ${hero.currentAttempt}/75 (${stake.toLocaleString('sr-RS')} RSD @ ${odd.toFixed(1)})`,
      stake,
      odd,
      potentialReturn: 0,
      result: 'loss',
      netProfit: -stake,
      note,
    };

    const nextAttempt = hero.currentAttempt < hero.maxAttempts ? hero.currentAttempt + 1 : 1;
    const newTotalLost = hero.currentAttempt < hero.maxAttempts ? hero.totalLostInCycle + stake : 0;

    const updatedHero: LudiloHero = {
      ...hero,
      currentAttempt: nextAttempt,
      totalLostInCycle: newTotalLost,
      stats: {
        ...hero.stats,
        losses: hero.stats.losses + 1,
        totalStaked: hero.stats.totalStaked + stake,
        netProfit: hero.stats.netProfit - stake,
      },
    };

    updateActiveProfile((prof) => {
      const newLudilo = [...prof.ludiloHeroes];
      newLudilo[heroIndex] = updatedHero;
      return {
        ...prof,
        ludiloHeroes: newLudilo,
        logs: [newLog, ...prof.logs],
        bankroll: { ...prof.bankroll, current: prof.bankroll.current - stake },
      };
    });
  };

  const handleResetLudiloHero = (heroId: string) => {
    updateActiveProfile((prof) => ({
      ...prof,
      ludiloHeroes: prof.ludiloHeroes.map((h) =>
        h.id === heroId ? { ...h, currentAttempt: 1, totalLostInCycle: 0 } : h
      ),
    }));
  };

  /* =====================================================================
     MODE 3: VARIJABILNI PROFIT MAŠINA HANDLERS
  ===================================================================== */
  const handleVariableWin = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.variableHeroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.variableHeroes[heroIndex];
    const calc = calculateVariableStake(hero, odd, hero.targetProfit);
    const stake = calc.stake;
    const grossReturn = calc.potentialGrossReturn;
    const netProfit = grossReturn - stake;

    sounds.playWin();
    triggerConfetti();

    setWinCelebrationData({
      heroName: hero.name,
      heroAvatar: hero.avatar,
      heroTitle: hero.title,
      modeName: 'Varijabilni Profit Mašina',
      stake,
      odd,
      grossReturn,
      netProfit,
    });

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'variable',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Cilj +${hero.targetProfit.toLocaleString('sr-RS')} RSD (Ulog: ${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: grossReturn,
      result: 'win',
      netProfit,
      note,
    };

    const updatedHero: VariableHero = {
      ...hero,
      totalLostInCycle: 0,
      cycleAttempts: 0,
      stats: {
        ...hero.stats,
        wins: hero.stats.wins + 1,
        totalStaked: hero.stats.totalStaked + stake,
        totalWon: hero.stats.totalWon + grossReturn,
        netProfit: hero.stats.netProfit + netProfit,
        completedCycles: hero.stats.completedCycles + 1,
      },
    };

    updateActiveProfile((prof) => {
      const newVars = [...prof.variableHeroes];
      newVars[heroIndex] = updatedHero;
      return {
        ...prof,
        variableHeroes: newVars,
        logs: [newLog, ...prof.logs],
        bankroll: { ...prof.bankroll, current: prof.bankroll.current + netProfit },
      };
    });
  };

  const handleVariableLoss = (heroId: string, odd: number, note: string) => {
    const heroIndex = activeProfile.variableHeroes.findIndex((h) => h.id === heroId);
    if (heroIndex === -1) return;

    const hero = activeProfile.variableHeroes[heroIndex];
    const calc = calculateVariableStake(hero, odd, hero.targetProfit);
    const stake = calc.stake;

    sounds.playLoss();

    const newLog: TicketLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      mode: 'variable',
      source: hero.id,
      heroName: hero.name,
      stepDescription: `Cilj +${hero.targetProfit.toLocaleString('sr-RS')} RSD (Ulog: ${stake.toLocaleString('sr-RS')} RSD)`,
      stake,
      odd,
      potentialReturn: 0,
      result: 'loss',
      netProfit: -stake,
      note,
    };

    const updatedHero: VariableHero = {
      ...hero,
      totalLostInCycle: hero.totalLostInCycle + stake,
      cycleAttempts: hero.cycleAttempts + 1,
      stats: {
        ...hero.stats,
        losses: hero.stats.losses + 1,
        totalStaked: hero.stats.totalStaked + stake,
        netProfit: hero.stats.netProfit - stake,
      },
    };

    updateActiveProfile((prof) => {
      const newVars = [...prof.variableHeroes];
      newVars[heroIndex] = updatedHero;
      return {
        ...prof,
        variableHeroes: newVars,
        logs: [newLog, ...prof.logs],
        bankroll: { ...prof.bankroll, current: prof.bankroll.current - stake },
      };
    });
  };

  const handleChangeTargetProfit = (heroId: string, newTarget: number) => {
    updateActiveProfile((prof) => ({
      ...prof,
      variableHeroes: prof.variableHeroes.map((h) =>
        h.id === heroId ? { ...h, targetProfit: newTarget } : h
      ),
    }));
  };

  const handleResetVariableHero = (heroId: string) => {
    updateActiveProfile((prof) => ({
      ...prof,
      variableHeroes: prof.variableHeroes.map((h) =>
        h.id === heroId ? { ...h, totalLostInCycle: 0, cycleAttempts: 0 } : h
      ),
    }));
  };

  // Aggregated Stats for active profile
  const totalStaked = activeProfile.logs.reduce((acc, l) => acc + l.stake, 0);
  const totalWon = activeProfile.logs.reduce((acc, l) => acc + (l.result === 'win' ? l.potentialReturn : 0), 0);
  const netProfit = totalWon - totalStaked;
  const totalWins = activeProfile.logs.filter((l) => l.result === 'win').length;
  const totalLosses = activeProfile.logs.filter((l) => l.result === 'loss').length;
  const activeRescueCount =
    (activeProfile.rescueState.activeHeroId ? 1 : 0) + activeProfile.rescueState.queue.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* If inside Home Screen (Hub) */}
      {currentView === 'hub' ? (
        <>
          <Header
            soundEnabled={config.soundEnabled}
            onToggleSound={() => setConfig((c) => ({ ...c, soundEnabled: !c.soundEnabled }))}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenSim={() => setIsSimOpen(true)}
            onResetAll={() => setIsResetConfirmOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            activeRescueCount={activeRescueCount}
            activeMode="ludilo25"
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
            <HomeHub
              profile={activeProfile}
              onEnterMode={(mode) => {
                if (mode === 'ludilo25') setCurrentView('mode_ludilo');
                else if (mode === 'kvota2') setCurrentView('mode_kvota2');
                else setCurrentView('mode_variable');
                sounds.playClick();
              }}
              onOpenProfiles={() => setIsProfilesOpen(true)}
              onOpenRules={() => setIsRulesOpen(true)}
              onOpenReset={() => setIsResetConfirmOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
            />

            {/* Global History Table on Home Hub */}
            <div className="mt-8">
              <HistoryTable
                logs={activeProfile.logs}
                onClearLogs={() => updateActiveProfile((prof) => ({ ...prof, logs: [] }))}
              />
            </div>
          </main>
        </>
      ) : (
        /* If inside a dedicated Game Mode */
        <>
          <ModeNavBar
            activeMode={activeGameMode!}
            profile={activeProfile}
            soundEnabled={config.soundEnabled}
            onBackToHub={() => {
              setCurrentView('hub');
              sounds.playClick();
            }}
            onSwitchMode={(mode) => {
              if (mode === 'ludilo25') setCurrentView('mode_ludilo');
              else if (mode === 'kvota2') setCurrentView('mode_kvota2');
              else setCurrentView('mode_variable');
            }}
            onOpenProfiles={() => setIsProfilesOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
            onToggleSound={() => setConfig((c) => ({ ...c, soundEnabled: !c.soundEnabled }))}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-10">
            {/* Mode-specific Bankroll & Stat Summary */}
            <BankrollSummary
              totalTickets={activeProfile.logs.filter((l) => l.mode === activeGameMode).length}
              totalStaked={activeProfile.logs
                .filter((l) => l.mode === activeGameMode)
                .reduce((acc, l) => acc + l.stake, 0)}
              totalWon={activeProfile.logs
                .filter((l) => l.mode === activeGameMode)
                .reduce((acc, l) => acc + (l.result === 'win' ? l.potentialReturn : 0), 0)}
              netProfit={
                activeProfile.logs
                  .filter((l) => l.mode === activeGameMode)
                  .reduce((acc, l) => acc + (l.result === 'win' ? l.potentialReturn : 0), 0) -
                activeProfile.logs
                  .filter((l) => l.mode === activeGameMode)
                  .reduce((acc, l) => acc + l.stake, 0)
              }
              totalWins={activeProfile.logs.filter((l) => l.mode === activeGameMode && l.result === 'win').length}
              totalLosses={activeProfile.logs.filter((l) => l.mode === activeGameMode && l.result === 'loss').length}
              activeMode={activeGameMode!}
              bankroll={activeProfile.bankroll}
              onUpdateInitialBankroll={(newInitial) =>
                updateActiveProfile((prof) => ({
                  ...prof,
                  bankroll: {
                    initial: newInitial,
                    current: newInitial + (prof.bankroll.current - prof.bankroll.initial),
                  },
                }))
              }
            />

            {/* SCREEN 1: DEDICATED LUDILO 7+ & PRELAZI (KVOTA 25+) */}
            {currentView === 'mode_ludilo' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-red-950/30 to-zinc-900 border border-orange-500/40">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span>LUDILO 7+ & PRELAZI IZ 2 U 1 I 1 U 2</span>
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-zinc-950">
                      Kvote 25+
                    </span>
                  </h2>
                  <p className="text-xs text-orange-300 font-medium mt-0.5">
                    Strategija 75 Pokušaja: 20 puta po 100 RSD → zatim blago povećavanje uloga da se vrati sve uloženo iz niza i zaradi!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeProfile.ludiloHeroes.map((hero) => (
                    <LudiloCard
                      key={hero.id}
                      hero={hero}
                      onWin={handleLudiloWin}
                      onLoss={handleLudiloLoss}
                      onReset={handleResetLudiloHero}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 2: DEDICATED KVOTA 2.0 SISTEM (3 HEROJA + FENIKS) */}
            {currentView === 'mode_kvota2' && (
              <div className="space-y-6">
                <RescueHeroCard
                  rescueState={activeProfile.rescueState}
                  heroes={activeProfile.heroes}
                  config={config}
                  onRescueWin={handleRescueWin}
                  onRescueLoss={handleRescueLoss}
                  onChangeFormula={(formula) => setConfig((c) => ({ ...c, rescueFormula: formula }))}
                />

                <div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-1">
                    <span>TRI HEROJA KVOTE 2.0</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Nezavisni Nizovi
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mb-4">
                    Ulozi: 100 RSD → 300 RSD → 1.000 RSD → 3.000 RSD → 9.000 RSD. Pogodak vraća na start!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeProfile.heroes.map((hero) => (
                      <HeroCard
                        key={hero.id}
                        hero={hero}
                        onWin={handleHeroWin}
                        onLoss={handleHeroLoss}
                        onManualReset={handleManualResetHero}
                        isBeingRescued={activeProfile.rescueState.activeHeroId === hero.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: DEDICATED VARIJABILNI PROFIT MAŠINA */}
            {currentView === 'mode_variable' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-zinc-900 border border-cyan-500/40">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span>VARIJABILNI PROFIT MAŠINA</span>
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-500 text-zinc-950">
                      Automatski Ulog
                    </span>
                  </h2>
                  <p className="text-xs text-cyan-300 font-medium mt-0.5">
                    Upišite kvotu utakmice, a računar sabira sve prethodne uloge u nizu i računa ulog za garantovanih 1.000, 5.000 ili 10.000 RSD profita!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeProfile.variableHeroes.map((hero) => (
                    <VariableHeroCard
                      key={hero.id}
                      hero={hero}
                      onWin={handleVariableWin}
                      onLoss={handleVariableLoss}
                      onReset={handleResetVariableHero}
                      onChangeTargetProfit={handleChangeTargetProfit}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* History Table for the active mode */}
            <div className="mt-8">
              <HistoryTable
                logs={activeProfile.logs.filter((l) => l.mode === activeGameMode)}
                onClearLogs={() =>
                  updateActiveProfile((prof) => ({
                    ...prof,
                    logs: prof.logs.filter((l) => l.mode !== activeGameMode),
                  }))
                }
              />
            </div>
          </main>
        </>
      )}

      {/* MODALS */}
      <ProfileModal
        isOpen={isProfilesOpen}
        onClose={() => setIsProfilesOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onUpdateProfilePassword={handleUpdateProfilePassword}
      />

      <ProfilePasswordModal
        isOpen={!!pendingUnlockProfile}
        profile={pendingUnlockProfile}
        onClose={() => setPendingUnlockProfile(null)}
        onSuccess={handleUnlockSuccess}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        activeMode={activeGameMode}
        onResetMode={handleResetMode}
        onResetEntireProfile={handleResetEntireProfile}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <ShareAppModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      <HeroWinCelebration data={winCelebrationData} onClose={() => setWinCelebrationData(null)} />

      <SimulationModal
        isOpen={isSimOpen}
        onClose={() => setIsSimOpen(false)}
        heroes={activeProfile.heroes}
        rescueState={activeProfile.rescueState}
        onSimulateHeroFall={() => {}}
        onSimulateRescueBet={() => {}}
        onSimulateRandomHeroBet={() => {}}
        onResetSimulation={handleResetEntireProfile}
      />

      <ReviveCelebration hero={revivedHero} onClose={() => setRevivedHero(null)} />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/80 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Kvota 2.0 • Ludilo 25+ • Varijabilni Profit</span>
          <span className="text-zinc-600">Igrač: {activeProfile.name} • Igrajte odgovorno</span>
        </div>
      </footer>
    </div>
  );
}
