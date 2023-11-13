export function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const rad = function (x) {
    return (x * Math.PI) / 180;
  };

  const R = 6378.137; //Radio de la tierra en km
  const dLat = rad(lat2 - lat1);
  const dLong = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

export function getFilters(params: any) {
  const filters = Object.keys(params).map((param) => {
    const regexs = params[param].map((str) => {
      return new RegExp(str, 'i');
    });
    return { [param]: { $in: regexs } };
  });

  return filters.length > 0 ? filters : [{}];
}
