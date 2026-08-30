import { useState, useMemo } from 'react';
import { CanjeTradeInState, Product, SupportedTradeInDevice, ConditionPenalties } from '../types';
import { calculateTradeInValue, getTradeInDevices } from '../data/canjeValuation';

const DEFAULT_TRADE_IN: CanjeTradeInState = {
  brand: 'Apple',
  model: 'iPhone 15 Pro Max',
  storage: '256GB',
  batteryPercentage: 88,
  batteryUnknown: false,
  screenStatus: 'intacta',
  bodyStatus: 'impecable',
  faceIdWorking: true,
  hasBoxAndCable: true
};

export function useCanje(
  initialTargetProduct: Product | null = null,
  customDevices?: SupportedTradeInDevice[],
  customPenalties?: Partial<ConditionPenalties>
) {
  const [tradeInState, setTradeInState] = useState<CanjeTradeInState>(DEFAULT_TRADE_IN);
  const [targetProduct, setTargetProduct] = useState<Product | null>(initialTargetProduct);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const devicesList = useMemo(() => {
    return getTradeInDevices(customDevices);
  }, [customDevices]);

  const availableModels = useMemo(() => {
    return devicesList.filter((d) => d.brand === tradeInState.brand);
  }, [devicesList, tradeInState.brand]);

  const availableCapacities = useMemo(() => {
    const currentDevice = devicesList.find(
      (d) => d.brand === tradeInState.brand && d.model === tradeInState.model
    );
    return currentDevice ? currentDevice.capacities.map((c) => c.storage) : ['128GB'];
  }, [devicesList, tradeInState.brand, tradeInState.model]);

  const setModel = (model: string) => {
    const device = devicesList.find((d) => d.brand === tradeInState.brand && d.model === model);
    const validStorage = device?.capacities[0]?.storage || '128GB';
    setTradeInState((prev) => ({
      ...prev,
      model,
      storage: validStorage
    }));
  };

  const setBrand = (brand: string) => {
    const firstDevice = devicesList.find((d) => d.brand === brand);
    if (firstDevice) {
      setTradeInState((prev) => ({
        ...prev,
        brand,
        model: firstDevice.model,
        storage: firstDevice.capacities[0].storage
      }));
    }
  };

  const updateState = <K extends keyof CanjeTradeInState>(key: K, value: CanjeTradeInState[K]) => {
    setTradeInState((prev) => ({ ...prev, [key]: value }));
  };

  const evaluation = useMemo(() => {
    return calculateTradeInValue(tradeInState, targetProduct, customDevices, customPenalties);
  }, [tradeInState, targetProduct, customDevices, customPenalties]);

  const resetCanje = (newTarget: Product | null = null) => {
    setTradeInState(DEFAULT_TRADE_IN);
    setTargetProduct(newTarget);
    setStep(1);
  };

  return {
    step,
    setStep,
    tradeInState,
    setBrand,
    setModel,
    updateState,
    availableModels,
    availableCapacities,
    targetProduct,
    setTargetProduct,
    evaluation,
    resetCanje
  };
}
