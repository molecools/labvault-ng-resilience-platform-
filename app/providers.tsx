'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import seedData from '@/data/mockData.json';
import type { Alert, Freezer, FreezerStatus, Reagent, ReagentStatus } from '@/data/types';
import { DEMO_UNIVERSITY, type Lab, type MockData, WHATSAPP_RECIPIENT } from '@/data/types';

type EmergencyInfo = {
  freezerId: string;
  freezerName: string;
  affectedCount: number;
  university: string;
  timestamp: string;
} | null;

type AppContextValue = MockData & {
  hydrated: boolean;
  emergencyInfo: EmergencyInfo;
  addReagent: (reagent: Reagent) => void;
  updateReagent: (id: string, changes: Partial<Reagent>) => void;
  deleteReagent: (id: string) => void;
  updateFreezerTemp: (freezerId: string, temp: number) => void;
  simulatePowerFailure: (freezerId: string) => void;
  clearEmergency: () => void;
};

const STORAGE_KEY = 'labvault-ng-state-v1';
const EMERGENCY_KEY = 'labvault-ng-emergency-v1';
const seed = seedData as MockData;

const getStatus = (targetTemp: Freezer['targetTemp'], temp: number): FreezerStatus => {
  if (targetTemp === -20) {
    if (temp > -15) return 'Critical';
    if (temp > -18) return 'Warning';
    return 'Stable';
  }
  if (targetTemp === -80) {
    if (temp > -70) return 'Critical';
    if (temp > -75) return 'Warning';
    return 'Stable';
  }
  if (temp > 8) return 'Critical';
  if (temp > 6 || temp < 1) return 'Warning';
  return 'Stable';
};

const formatTemp = (temp: number) => `${temp > 0 ? '' : ''}${Number.isInteger(temp) ? temp : temp.toFixed(1)}°C`;

const initialData = (): MockData => ({
  labs: seed.labs,
  reagents: seed.reagents,
  freezers: seed.freezers,
  alerts: seed.alerts,
});

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MockData>(initialData);
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const savedEmergency = window.localStorage.getItem(EMERGENCY_KEY);
      if (saved) setData(JSON.parse(saved) as MockData);
      if (savedEmergency) setEmergencyInfo(JSON.parse(savedEmergency) as EmergencyInfo);
    } catch {
      // If browser storage is unavailable, the seeded in-memory state still keeps the demo usable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (emergencyInfo) window.localStorage.setItem(EMERGENCY_KEY, JSON.stringify(emergencyInfo));
    else window.localStorage.removeItem(EMERGENCY_KEY);
  }, [data, emergencyInfo, hydrated]);

  const addReagent = useCallback((reagent: Reagent) => {
    setData((current) => ({ ...current, reagents: [reagent, ...current.reagents] }));
  }, []);

  const updateReagent = useCallback((id: string, changes: Partial<Reagent>) => {
    setData((current) => ({
      ...current,
      reagents: current.reagents.map((reagent) => reagent.id === id ? { ...reagent, ...changes } : reagent),
    }));
  }, []);

  const deleteReagent = useCallback((id: string) => {
    setData((current) => ({ ...current, reagents: current.reagents.filter((reagent) => reagent.id !== id) }));
  }, []);

  const triggerCritical = useCallback((freezerId: string, temp: number) => {
    const freezer = data.freezers.find((item) => item.id === freezerId);
    if (!freezer || freezer.status === 'Critical') return;
    const affected = data.reagents.filter((reagent) => freezer.reagentsInside.includes(reagent.id));
    const lab = data.labs.find((item) => item.id === freezer.labId);
    const university = lab?.university ?? 'Network';
    const timestamp = new Date().toISOString();
    const message = `CRITICAL: ${freezer.name} at ${formatTemp(temp)}! ${affected.length} reagents at risk!`;
    const alerts: Alert[] = [
      { id: `alert-${Date.now()}-dashboard`, freezerId, timestamp, temp, message, type: 'Dashboard' },
      { id: `alert-${Date.now()}-sms`, freezerId, timestamp, temp, message: `SMS SIMULATION · ${message}`, type: 'SMS' },
      { id: `alert-${Date.now()}-whatsapp`, freezerId, timestamp, temp, message: `WhatsApp SIMULATION → ${WHATSAPP_RECIPIENT} · ${affected.length} reagents from ${university} need an emergency swap.`, type: 'WhatsApp' },
    ];
    setData((current) => ({
      ...current,
      freezers: current.freezers.map((item) => item.id === freezerId ? { ...item, currentTemp: temp, status: 'Critical' } : item),
      reagents: current.reagents.map((reagent) => freezer.reagentsInside.includes(reagent.id)
        ? { ...reagent, status: 'AT RISK - EMERGENCY SWAP' as ReagentStatus, isEmergencySwap: true }
        : reagent),
      alerts: [...alerts, ...current.alerts],
    }));
    setEmergencyInfo({ freezerId, freezerName: freezer.name, affectedCount: affected.length, university, timestamp });
  }, [data.freezers, data.labs, data.reagents]);

  const updateFreezerTemp = useCallback((freezerId: string, temp: number) => {
    const freezer = data.freezers.find((item) => item.id === freezerId);
    if (!freezer) return;
    const status = freezer.status === 'Critical' ? 'Critical' : getStatus(freezer.targetTemp, temp);
    setData((current) => ({
      ...current,
      freezers: current.freezers.map((item) => item.id === freezerId ? { ...item, currentTemp: temp, status } : item),
    }));
    if (status === 'Critical' && freezer.status !== 'Critical') triggerCritical(freezerId, temp);
  }, [data.freezers, triggerCritical]);

  const simulatePowerFailure = useCallback((freezerId: string) => {
    const freezer = data.freezers.find((item) => item.id === freezerId);
    if (!freezer) return;
    if (freezer.status === 'Critical') {
      setData((current) => ({
        ...current,
        freezers: current.freezers.map((item) => item.id === freezerId ? { ...item, currentTemp: 0, status: 'Critical' } : item),
      }));
      return;
    }
    // The explicit demo action represents a power loss, so it is always a Critical incident,
    // including for the 4°C cold room where 0°C is otherwise a Warning reading.
    triggerCritical(freezerId, 0);
  }, [data.freezers, triggerCritical]);

  const clearEmergency = useCallback(() => setEmergencyInfo(null), []);

  const value = useMemo(() => ({
    ...data,
    hydrated,
    emergencyInfo,
    addReagent,
    updateReagent,
    deleteReagent,
    updateFreezerTemp,
    simulatePowerFailure,
    clearEmergency,
  }), [data, hydrated, emergencyInfo, addReagent, updateReagent, deleteReagent, updateFreezerTemp, simulatePowerFailure, clearEmergency]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProviders');
  return value;
}

export function useDemoReagents() {
  const { reagents } = useApp();
  return reagents.filter((reagent) => reagent.university === DEMO_UNIVERSITY);
}
