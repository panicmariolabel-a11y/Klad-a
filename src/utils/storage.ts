import {
  Hero,
  RescueState,
  TicketLog,
  AppConfig,
  GameMode,
  LudiloHero,
  VariableHero,
  UserProfile,
} from '../types';
import {
  INITIAL_HEROES,
  INITIAL_RESCUE_STATE,
  INITIAL_LUDILO_HEROES,
  INITIAL_VARIABLE_HEROES,
  INITIAL_CONFIG,
} from './engine';

const PROFILES_KEY = 'kvota2_profiles_v3';
const ACTIVE_PROFILE_KEY = 'kvota2_active_profile_v3';
const CONFIG_KEY = 'kvota2_config_v3';

export function createDefaultProfile(
  id: string = 'profile-default',
  name: string = 'Moj Profil',
  color: string = 'amber',
  password?: string
): UserProfile {
  return {
    id,
    name,
    avatarColor: color,
    createdAt: Date.now(),
    password: password || undefined,
    isPasswordProtected: !!password,
    bankroll: { initial: 50000, current: 50000 },
    heroes: INITIAL_HEROES,
    rescueState: INITIAL_RESCUE_STATE,
    ludiloHeroes: INITIAL_LUDILO_HEROES,
    variableHeroes: INITIAL_VARIABLE_HEROES,
    logs: [],
  };
}

export function loadProfiles(): { profiles: UserProfile[]; activeId: string } {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const active = localStorage.getItem(ACTIVE_PROFILE_KEY);

    if (raw) {
      const parsed: UserProfile[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validActive = parsed.some((p) => p.id === active) ? (active as string) : parsed[0].id;
        return { profiles: parsed, activeId: validActive };
      }
    }
  } catch (e) {
    console.error('Failed to load profiles', e);
  }

  const initialProfile = createDefaultProfile();
  return {
    profiles: [initialProfile],
    activeId: initialProfile.id,
  };
}

export function saveProfiles(profiles: UserProfile[], activeId: string) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(ACTIVE_PROFILE_KEY, activeId);
  } catch (e) {
    console.error('Failed to save profiles', e);
  }
}

export function loadAppConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...INITIAL_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load config', e);
  }
  return INITIAL_CONFIG;
}

export function saveAppConfig(config: AppConfig) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config', e);
  }
}
