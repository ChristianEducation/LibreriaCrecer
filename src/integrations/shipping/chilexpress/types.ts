export type ChilexpressCoverageRequest = {
  regionCode?: string;
  commune: string;
};

export type ChilexpressCoverageArea = {
  countyCode?: string;
  countyName?: string;
  regionCode?: string;
  regionName?: string;
};

export type ChilexpressPackage = {
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
};

export type ChilexpressRateRequest = {
  originCoverageCode: string;
  destinationCoverageCode: string;
  package: ChilexpressPackage;
  productType?: number;
  contentType?: number;
  declaredWorth?: number;
};

export type ChilexpressRateOption = {
  serviceTypeCode: string;
  serviceDescription: string;
  serviceValue: number;
  deliveryTypeCode?: string;
  conditions?: string;
};

export type ChilexpressShipmentRequest = {
  orderNumber: string;
  serviceTypeCode: string;
  originCoverageCode: string;
  destinationCoverageCode: string;
  package: ChilexpressPackage;
  recipient: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    apartment?: string | null;
    commune: string;
    city: string;
    region: string;
    zipCode?: string | null;
    deliveryInstructions?: string | null;
  };
};

export type ChilexpressShipmentResponse = {
  transportOrderNumber?: string;
  reference?: string;
  labelUrl?: string;
  raw: unknown;
};
