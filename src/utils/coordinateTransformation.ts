/**
 * 相对坐标系坐标转经纬高坐标
 * @param lon 目标经度（结果）
 * @param lat 目标纬度（结果）
 * @param h 目标高（结果）
 * @param lon0 激光车经度
 * @param lat0 激光车纬度
 * @param h0 激光车高
 * @param xEast 目标东（相对坐标系坐标）
 * @param yNorth 目标北（相对坐标系坐标）
 * @param zUp 目标高（相对坐标系坐标）
 * @returns [lon, lat, h] 目标经纬高
 */
export function ENU_TO_LLA(
  lon: number,
  lat: number,
  h: number,
  lon0: number,
  lat0: number,
  h0: number,
  xEast: number,
  yNorth: number,
  zUp: number
) {
  const pi = 3.14159265359
  const a = 6378137
  const b = 6356752.3142
  const f = (a - b) / a
  const e_sq = f * (2 - f)
  const lamb = (pi / 180) * lat0
  const phi = (pi / 180) * lon0
  const s = Math.sin(lamb)
  const N = a / Math.sqrt(1 - e_sq * s * s)

  const sin_lambda = Math.sin(lamb)
  const cos_lambda = Math.cos(lamb)
  const sin_phi = Math.sin(phi)
  const cos_phi = Math.cos(phi)

  const x0 = (h0 + N) * cos_lambda * cos_phi
  const y0 = (h0 + N) * cos_lambda * sin_phi
  const z0 = (h0 + (1 - e_sq) * N) * sin_lambda

  const t = cos_lambda * zUp - sin_lambda * yNorth

  const zd = sin_lambda * zUp + cos_lambda * yNorth
  const xd = cos_phi * t - sin_phi * xEast
  const yd = sin_phi * t + cos_phi * xEast
  // ENU转ECEF
  const x = xd + x0
  const y = yd + y0
  const z = zd + z0

  const x2 = x * x
  const y2 = y * y
  const z2 = z * z

  const e = Math.sqrt(1 - (b / a) * (b / a))
  const b2 = b * b
  const e2 = e * e
  const ep = e * (a / b)
  const r = Math.sqrt(x2 + y2)
  const r2 = r * r
  const E2 = a * a - b * b
  const F = 54 * b2 * z2
  const G = r2 + (1 - e2) * z2 - e2 * E2
  const c = (e2 * e2 * F * r2) / (G * G * G)
  const s2 = Math.pow(1 + c + Math.sqrt(c * c + 2 * c), 1 / 3)
  const P = F / (3 * (s2 + 1 / s2 + 1) * (s2 + 1 / s2 + 1) * G * G)
  const Q = Math.sqrt(1 + 2 * e2 * e2 * P)
  const ro =
    -(P * e2 * r) / (1 + Q) +
    Math.sqrt(((a * a) / 2) * (1 + 1 / Q) - (P * (1 - e2) * z2) / (Q * (1 + Q)) - (P * r2) / 2)
  const tmp = (r - e2 * ro) * (r - e2 * ro)
  const U = Math.sqrt(tmp + z2)
  const V = Math.sqrt(tmp + (1 - e2) * z2)
  const zo = (b2 * z) / (a * V)

  const height = U * (1 - b2 / (a * V))

  lat = Math.atan((z + ep * ep * zo) / r)

  const temp = Math.atan(y / x)

  let longitude
  if (x >= 0) longitude = temp
  else {
    if (x < 0 && y >= 0) longitude = pi + temp
    else longitude = temp - pi
  }

  lat = lat / (pi / 180)
  lon = longitude / (pi / 180)
  h = height

  return [lon, lat, h]
}

/**
 * 相对坐标系坐标数组转经纬高坐标
 * @param routeCoord 目标轨迹坐标，格式：[[x,y,z],[x,y,z],...]
 * @param laserCoord 激光车坐标，格式：[x,y,z]
 * @returns [lon, lat, h] 目标经纬高数组
 */
export const coordiArrayTrans = (routeCoord: Array<Array<number>>, laserCoord: Array<number>) => {
  const [lon, lat, h] = laserCoord
  // const newArr = routeCoord.filter((item) => item != null);
  const newArr = []
  routeCoord.forEach((item) => {
    if (item != null) {
      newArr.push(JSON.parse(JSON.stringify(item)))
    }
  })
  return Array.from(newArr, (coord) =>
    ENU_TO_LLA(coord[0], coord[1], coord[2], lon, lat, h, coord[0], coord[1], coord[2])
  )
}

