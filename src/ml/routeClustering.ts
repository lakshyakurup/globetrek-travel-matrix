export interface StopPoint { id: string; latitude: number; longitude: number; }
export interface Cluster { centroid: [number, number]; stops: StopPoint[]; }

export function clusterRoutes(points: StopPoint[], k: number, iterations = 20): Cluster[] {
  if (k < 1 || k > points.length) throw new Error("k must be between one and the number of points");
  let centroids = points.slice(0, k).map((point) => [point.latitude, point.longitude] as [number, number]);
  for (let iteration = 0; iteration < iterations; iteration++) {
    const assignments = points.map((point) => nearest(point, centroids));
    centroids = centroids.map((centroid, index) => {
      const members = points.filter((_, pointIndex) => assignments[pointIndex] === index);
      return members.length ? [members.reduce((sum, point) => sum + point.latitude, 0) / members.length, members.reduce((sum, point) => sum + point.longitude, 0) / members.length] : centroid;
    });
  }
  return centroids.map((centroid, index) => ({ centroid, stops: points.filter((point) => nearest(point, centroids) === index) }));
}

function nearest(point: StopPoint, centroids: [number, number][]): number {
  return centroids.reduce((best, centroid, index) => distance(point, centroid) < distance(point, centroids[best]) ? index : best, 0);
}
function distance(point: StopPoint, centroid: [number, number]): number { return (point.latitude - centroid[0]) ** 2 + (point.longitude - centroid[1]) ** 2; }
