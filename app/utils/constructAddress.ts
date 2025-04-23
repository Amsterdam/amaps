export function constructAddress(addressData: any): string {
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
