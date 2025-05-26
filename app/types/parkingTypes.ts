export const parkingTypes: Record<string, { label: string; reservable: boolean }> = {
  E1: { label: "Parkeerverbod", reservable: false },
  E5: { label: "Taxistandplaats", reservable: false },
  E6a: { label: "Gehandicaptenplaats algemeen", reservable: false },
  E6b: { label: "Gehandicaptenplaats kenteken", reservable: false },
  E7: { label: "Laden en lossen", reservable: false },
  E8: { label: "Specifieke voertuigcategorie", reservable: false },
  E9: { label: "Vergunninghouders", reservable: false },
  E10: { label: "Blauwe zone", reservable: true },
  "": { label: "Zonder parkeertype", reservable: true },
};