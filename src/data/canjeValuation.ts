import { CanjeTradeInState, CanjeEvaluationResult, Product, SupportedTradeInDevice, ConditionPenalties } from '../types';

export const SUPPORTED_TRADE_IN_DEVICES: SupportedTradeInDevice[] = [
  // --- iPHONES 17 ---
  {
    brand: 'Apple',
    model: 'iPhone 17 Pro Max',
    capacities: [
      { storage: '256GB', basePriceUSD: 1100 },
      { storage: '512GB', basePriceUSD: 1250 },
      { storage: '1TB', basePriceUSD: 1400 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 17 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 950 },
      { storage: '256GB', basePriceUSD: 1050 },
      { storage: '512GB', basePriceUSD: 1150 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 17 Air',
    capacities: [
      { storage: '128GB', basePriceUSD: 850 },
      { storage: '256GB', basePriceUSD: 950 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 17',
    capacities: [
      { storage: '128GB', basePriceUSD: 800 },
      { storage: '256GB', basePriceUSD: 900 }
    ]
  },
  // --- iPHONES 16 ---
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    capacities: [
      { storage: '256GB', basePriceUSD: 950 },
      { storage: '512GB', basePriceUSD: 1050 },
      { storage: '1TB', basePriceUSD: 1150 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 16 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 820 },
      { storage: '256GB', basePriceUSD: 900 },
      { storage: '512GB', basePriceUSD: 980 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 16 Plus',
    capacities: [
      { storage: '128GB', basePriceUSD: 700 },
      { storage: '256GB', basePriceUSD: 780 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 16',
    capacities: [
      { storage: '128GB', basePriceUSD: 650 },
      { storage: '256GB', basePriceUSD: 720 }
    ]
  },
  // --- iPHONES 15 ---
  {
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    capacities: [
      { storage: '256GB', basePriceUSD: 850 },
      { storage: '512GB', basePriceUSD: 930 },
      { storage: '1TB', basePriceUSD: 1000 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 720 },
      { storage: '256GB', basePriceUSD: 780 },
      { storage: '512GB', basePriceUSD: 840 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 15 Plus',
    capacities: [
      { storage: '128GB', basePriceUSD: 600 },
      { storage: '256GB', basePriceUSD: 660 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 15',
    capacities: [
      { storage: '128GB', basePriceUSD: 540 },
      { storage: '256GB', basePriceUSD: 600 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    capacities: [
      { storage: '128GB', basePriceUSD: 660 },
      { storage: '256GB', basePriceUSD: 710 },
      { storage: '512GB', basePriceUSD: 760 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 570 },
      { storage: '256GB', basePriceUSD: 620 },
      { storage: '512GB', basePriceUSD: 670 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 14 Plus',
    capacities: [
      { storage: '128GB', basePriceUSD: 460 },
      { storage: '256GB', basePriceUSD: 510 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 14',
    capacities: [
      { storage: '128GB', basePriceUSD: 420 },
      { storage: '256GB', basePriceUSD: 470 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 13 Pro Max',
    capacities: [
      { storage: '128GB', basePriceUSD: 510 },
      { storage: '256GB', basePriceUSD: 560 },
      { storage: '512GB', basePriceUSD: 610 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 440 },
      { storage: '256GB', basePriceUSD: 490 },
      { storage: '512GB', basePriceUSD: 530 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 13',
    capacities: [
      { storage: '128GB', basePriceUSD: 360 },
      { storage: '256GB', basePriceUSD: 410 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 12 Pro Max',
    capacities: [
      { storage: '128GB', basePriceUSD: 390 },
      { storage: '256GB', basePriceUSD: 430 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 12 Pro',
    capacities: [
      { storage: '128GB', basePriceUSD: 330 },
      { storage: '256GB', basePriceUSD: 370 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 12',
    capacities: [
      { storage: '64GB', basePriceUSD: 240 },
      { storage: '128GB', basePriceUSD: 280 }
    ]
  },
  {
    brand: 'Apple',
    model: 'iPhone 11',
    capacities: [
      { storage: '64GB', basePriceUSD: 170 },
      { storage: '128GB', basePriceUSD: 210 }
    ]
  },

  // --- SAMSUNG GALAXY ---
  {
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    capacities: [
      { storage: '256GB', basePriceUSD: 580 },
      { storage: '512GB', basePriceUSD: 640 }
    ]
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S23 Plus',
    capacities: [
      { storage: '256GB', basePriceUSD: 420 }
    ]
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S23',
    capacities: [
      { storage: '128GB', basePriceUSD: 350 },
      { storage: '256GB', basePriceUSD: 390 }
    ]
  },
  {
    brand: 'Samsung',
    model: 'Galaxy S22 Ultra',
    capacities: [
      { storage: '128GB', basePriceUSD: 380 },
      { storage: '256GB', basePriceUSD: 420 }
    ]
  }
];

export const DEFAULT_CONDITION_PENALTIES: ConditionPenalties = {
  batteryPct88to94: 5,
  batteryPct80to87: 10,
  batteryPctBelow80: 20,
  batteryUnknown: 8,
  screenMicrorayones: 5,
  screenRajada: 35,
  screenCambiada: 18,
  bodyMarcasLeves: 4,
  bodyGolpes: 12,
  faceIdDefect: 25,
  boxCableBonusUSD: 15
};

export function getTradeInDevices(customDevices?: SupportedTradeInDevice[]): SupportedTradeInDevice[] {
  return customDevices && customDevices.length > 0 ? customDevices : SUPPORTED_TRADE_IN_DEVICES;
}

export function calculateTradeInValue(
  state: CanjeTradeInState,
  targetProduct: Product | null = null,
  customDevices?: SupportedTradeInDevice[],
  customPenalties?: Partial<ConditionPenalties>
): CanjeEvaluationResult {
  const devicesList = getTradeInDevices(customDevices);
  const penalties = { ...DEFAULT_CONDITION_PENALTIES, ...(customPenalties || {}) };

  const device = devicesList.find(
    (d) => d.brand === state.brand && d.model === state.model
  );

  const capacityObj = device?.capacities.find((c) => c.storage === state.storage);
  const baseValue = capacityObj ? capacityObj.basePriceUSD : 200;

  // Deducción por batería (porcentaje exacto o desconocido)
  let batteryDeduction = 0;

  if (state.batteryUnknown) {
    batteryDeduction = Math.round(baseValue * (penalties.batteryUnknown / 100));
  } else if (typeof state.batteryPercentage === 'number') {
    const pct = state.batteryPercentage;
    if (pct >= 95) {
      batteryDeduction = 0;
    } else if (pct >= 88) {
      batteryDeduction = Math.round(baseValue * (penalties.batteryPct88to94 / 100));
    } else if (pct >= 80) {
      batteryDeduction = Math.round(baseValue * (penalties.batteryPct80to87 / 100));
    } else {
      batteryDeduction = Math.round(baseValue * (penalties.batteryPctBelow80 / 100)) + 30; // Menor a 80%
    }
  } else {
    batteryDeduction = Math.round(baseValue * (penalties.batteryUnknown / 100));
  }

  // Deducción por pantalla
  let screenDeduction = 0;
  if (state.screenStatus === 'microrayones') {
    screenDeduction = Math.round(baseValue * (penalties.screenMicrorayones / 100));
  } else if (state.screenStatus === 'rajada') {
    screenDeduction = Math.round(baseValue * (penalties.screenRajada / 100));
  } else if (state.screenStatus === 'cambiada') {
    screenDeduction = Math.round(baseValue * (penalties.screenCambiada / 100));
  }

  // Deducción por chasis
  let bodyDeduction = 0;
  if (state.bodyStatus === 'marcas_leves') {
    bodyDeduction = Math.round(baseValue * (penalties.bodyMarcasLeves / 100));
  } else if (state.bodyStatus === 'golpes') {
    bodyDeduction = Math.round(baseValue * (penalties.bodyGolpes / 100));
  }

  // FaceID / TouchID
  let faceIdDeduction = 0;
  if (!state.faceIdWorking) {
    faceIdDeduction = Math.round(baseValue * (penalties.faceIdDefect / 100));
  }

  // Bonus por caja y cable original
  let bonusBonus = 0;
  if (state.hasBoxAndCable) {
    bonusBonus = penalties.boxCableBonusUSD;
  }

  const finalDeductions = batteryDeduction + screenDeduction + bodyDeduction + faceIdDeduction;
  const estimatedValueUSD = Math.max(50, Math.round(baseValue - finalDeductions + bonusBonus));

  const targetPrice = targetProduct ? targetProduct.priceUSD : 0;
  const differenceToPayUSD = Math.max(0, targetPrice - estimatedValueUSD);

  return {
    tradeInModel: state.model,
    tradeInStorage: state.storage,
    estimatedValueUSD,
    targetProduct,
    differenceToPayUSD,
    breakdown: {
      baseValue,
      batteryDeduction,
      screenDeduction,
      bodyDeduction,
      bonusBonus
    }
  };
}
