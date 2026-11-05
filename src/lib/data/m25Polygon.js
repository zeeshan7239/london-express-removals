/**
 * Approximate centre-line of the M25 as a polygon, [latitude, longitude] pairs.
 *
 * It is built from the positions of the motorway junctions (J1 Dartford
 * Crossing round to J31) and is accurate to roughly 1-2 km. It is only used
 * for places OUTSIDE Greater London (for example Epsom, Watford or Dartford),
 * because every postcode that postcodes.io reports as region "London" is
 * already treated as inside the service area.
 *
 * To make it more exact, replace the points below with a boundary exported
 * from a mapping tool. Nothing else needs to change.
 */
export const M25_POLYGON = [
  [51.4570,  0.2560], // Dartford Crossing
  [51.4840,  0.2790], // J31 Thurrock
  [51.5050,  0.2890], // J30 Lakeside
  [51.5790,  0.2830], // J29 A127 Upminster
  [51.6300,  0.2480], // J28 Brentwood (A12)
  [51.6560,  0.1150], // J27 M11
  [51.6650,  0.0400], // J26 Waltham Abbey
  [51.6740, -0.0430], // J25 A10 Waltham Cross
  [51.7040, -0.1700], // J24 Potters Bar
  [51.6980, -0.2200], // J23 South Mimms
  [51.7080, -0.3050], // J22 London Colney
  [51.7120, -0.3940], // J21 M1
  [51.7050, -0.4400], // J20 Kings Langley
  [51.6900, -0.4800], // J19 Chipperfield
  [51.6580, -0.5300], // J18 Chorleywood
  [51.6330, -0.5100], // J17 Maple Cross
  [51.5750, -0.5000], // J16 M40
  [51.4880, -0.4920], // J15 M4
  [51.4650, -0.4930], // J14 Heathrow
  [51.4400, -0.5250], // J13 Staines
  [51.3990, -0.5330], // J12 M3
  [51.3780, -0.5160], // J11 Chertsey
  [51.3160, -0.4710], // J10 Wisley
  [51.3180, -0.3300], // J9 Leatherhead
  [51.2830, -0.2050], // J8 Reigate
  [51.2690, -0.1510], // J7 M23
  [51.2530, -0.0650], // J6 Godstone
  [51.2710,  0.0700], // Westerham
  [51.2780,  0.1100],
  [51.2900,  0.1560], // J5 Sevenoaks (M26)
  [51.3480,  0.1120], // J4 Orpington
  [51.3990,  0.1920], // J3 Swanley (M20)
  [51.4200,  0.2620], // J2 Dartford (A2)
];
