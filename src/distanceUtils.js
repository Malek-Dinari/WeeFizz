// distanceUtils.js

/**
 * Calculate Euclidean distance between two points.
 * @param {Array<number>} point1 - The first point as [x, y, confidence].
 * @param {Array<number>} point2 - The second point as [x, y, confidence].
 * @returns {number} - The distance between the two points.
 */
export const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 0;
    
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    
    // Calculate Euclidean distance
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };
  