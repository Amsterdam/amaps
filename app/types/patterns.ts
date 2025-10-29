import L from "leaflet";
import { parkingColors } from "./parkingColors";

export const stripePattern = (map: L.Map) => {
  const pattern = new (L as any).StripePattern({
    weight: 2,
    spaceWeight: 9,
    color: parkingColors.nonReservable.borderColor,
    spaceColor: parkingColors.nonReservable.fillColor,
    spaceOpacity: 1.0,
    angle: 45,
    opacity: 1.0,
  });
  pattern.addTo(map);
  return pattern;
};

export const specialeBestemmingDotPattern = (map: L.Map) => {
  const pattern = new (L as any).Pattern({
    width: 10,
    height: 10,
    patternUnits: "userSpaceOnUse",
  });

  const background = new (L as any).PatternRect({
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    fill: true,
    fillColor: parkingColors.specialeBestemming.fillColor,
    fillOpacity: 1.0,
    stroke: false,
  });

  const dot = new (L as any).PatternCircle({
    x: 5,
    y: 5,
    radius: 2,
    fill: true,
    fillColor: parkingColors.specialeBestemming.borderColor,
    fillOpacity: 1.0,
    stroke: false,
  });

  pattern.addShape(background);
  pattern.addShape(dot);
  pattern.addTo(map);
  return pattern;
};

export const greenDotPattern = (map: L.Map) => {
  const pattern = new (L as any).Pattern({
    width: 10,
    height: 10,
    patternUnits: "userSpaceOnUse",
  });

  const background = new (L as any).PatternRect({
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    fill: true,
    fillColor: parkingColors.selected.fillColor,
    fillOpacity: 1.0,
    stroke: false,
  });

  const dot = new (L as any).PatternCircle({
    x: 5,
    y: 5,
    radius: 2,
    fill: true,
    fillColor: parkingColors.selected.borderColor,
    fillOpacity: 1.0,
    stroke: false,
  });

  pattern.addShape(background);
  pattern.addShape(dot);
  pattern.addTo(map);
  return pattern;
};
