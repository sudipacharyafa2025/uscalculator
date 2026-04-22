/** Length-unit conversions for geometry calculators. Base unit is METERS. */
export type LengthUnit = "m" | "cm" | "mm" | "km" | "in" | "ft" | "yd" | "mi";

export const LENGTH_LABELS: Record<LengthUnit, string> = {
  m: "Meters (m)",
  cm: "Centimeters (cm)",
  mm: "Millimeters (mm)",
  km: "Kilometers (km)",
  in: "Inches (in)",
  ft: "Feet (ft)",
  yd: "Yards (yd)",
  mi: "Miles (mi)",
};

const TO_M: Record<LengthUnit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

export const LENGTH_UNITS: LengthUnit[] = ["m", "cm", "mm", "km", "in", "ft", "yd", "mi"];

export const toMeters = (v: number, u: LengthUnit) => v * TO_M[u];
export const fromMeters = (v: number, u: LengthUnit) => v / TO_M[u];
export const convertLength = (v: number, from: LengthUnit, to: LengthUnit) =>
  fromMeters(toMeters(v, from), to);

export const areaUnit = (u: LengthUnit) => `${u}²`;
export const volumeUnit = (u: LengthUnit) => `${u}³`;

/** Convert area between square units */
export const convertArea = (v: number, from: LengthUnit, to: LengthUnit) => {
  const f = TO_M[from] / TO_M[to];
  return v * f * f;
};

/** Convert volume between cubic units */
export const convertVolume = (v: number, from: LengthUnit, to: LengthUnit) => {
  const f = TO_M[from] / TO_M[to];
  return v * f * f * f;
};
