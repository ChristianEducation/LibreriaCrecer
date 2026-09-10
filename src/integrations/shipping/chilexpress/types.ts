export type ChilexpressCoverageRequest = {
  regionCode?: string;
  commune: string;
};

export type ChilexpressCoverageArea = {
  countyCode?: string;
  countyName?: string;
  regionCode?: string;
  coverageName?: string;
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
  deliveryTime?: number;
  /** TCC — obtenido de CHILEXPRESS_TCC, nunca del frontend. */
  customerCardNumber?: string;
};

/**
 * `serviceValueDiscount` es el valor final del servicio según el contrato oficial
 * (rest-rating-api.json). `effectiveValue` ya resuelve cuál usar: serviceValueDiscount
 * si es un número válido, si no cae a serviceValue.
 */
export type ChilexpressRateOption = {
  serviceTypeCode: string;
  serviceDescription: string;
  serviceValue: number;
  serviceValueDiscount: number | null;
  effectiveValue: number;
  deliveryType?: number;
  conditions?: string;
};

export type ChilexpressShipmentRequest = {
  orderNumber: string;
  serviceTypeCode: string;
  originCoverageCode: string;
  destinationCoverageCode: string;
  package: ChilexpressPackage;
  declaredWorth: number;
  /** 0 = Solo Datos, 1 = EPL Zebra, 2 = Imagen Binaria. Crecer usa 2. */
  labelType: 0 | 1 | 2;
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
    observation?: string | null;
  };
  sender: {
    name: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    apartment?: string | null;
    commune: string;
  };
};

export type ChilexpressShipmentResponse = {
  transportOrderNumber: string | null;
  reference: string | null;
  serviceDescription: string | null;
  /** Base64 crudo de label.labelData (labelType=2 => imagen binaria). null si Chilexpress no devolvió etiqueta. */
  labelData: string | null;
  /** Mime type detectado por el contenido: image/jpeg, image/png, application/pdf u octet-stream. */
  labelMimeType: string | null;
  raw: unknown;
};
