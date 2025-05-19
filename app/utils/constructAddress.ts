export function constructAddress(addressData: any): string {
  if (!addressData || addressData.length == 0) {
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
