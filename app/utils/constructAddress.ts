type AddressData = {
  openbare_ruimte: string;
  huisnummer: string | number;
  huisnummer_toevoeging?: string;
  huisletter?: string;
  postcode: string;
  woonplaats: string;
};

export function constructAddress(addressData: AddressData | null | undefined): string {
  if (!addressData) {
    return 'Er kon geen adres gevonden worden';
  }

  const straat = addressData.openbare_ruimte;
  const huisnummer = addressData.huisnummer;
  const huisnummerToevoeging = addressData.huisnummer_toevoeging
    ? `-${addressData.huisnummer_toevoeging}`
    : "";
  const huisletterToevoeging = addressData.huisletter || "";
  const postcode = addressData.postcode;
  const woonplaats = addressData.woonplaats;

  const fullAddress = `${straat} ${huisnummer}${huisletterToevoeging}${huisnummerToevoeging}, ${postcode} ${woonplaats}`;

  return fullAddress;
}
