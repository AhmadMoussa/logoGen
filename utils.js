// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return { x, y }
}

function generatePartitions(N) {
  let partitions = [];

  for (let n = 0; n < N + 1; n++) {
    partitions.push(min(max(0, randomGaussian(0.5, 0.5)), 1));
  }

  let sum = partitions.reduce((p, c) => p + c, 0);

  let mappedPartitions = partitions.map((p) => p / sum);

  let incrementallySummedPartitions = mappedPartitions.map((elem, index) =>
    mappedPartitions.slice(0, index + 1).reduce((a, b) => a + b)
  );

  return incrementallySummedPartitions.slice(
    0,
    incrementallySummedPartitions.length - 1
  );
}

function areCoordinatesClose(coord1, coord2, margin) {
  // Calculate Euclidean distance
  var distance = Math.sqrt(Math.pow(coord2.v.x - coord1.v.x, 2) + Math.pow(coord2.v.y - coord1.v.y, 2));

  // Compare distance with the margin
  return distance <= margin;
}

/* -------------------------------------------------------------------------
    ACCEPTS A LIST OF COORDINATES IF THERE ARE 3 
        OR MORE COORDINATES IN THIS LIST THAT ARE VERY CLOSE THEY ARE REMOVED
------------------------------------------------------------------------- */

function removeInternalVertices(coordinates, margin) {
  // Iterate through the coordinates and filter out the close ones
  var filteredCoordinates = coordinates.filter(function (coord, index, array) {
    // Count the number of coordinates close to the current coord
    var closeCount = array.reduce(function (count, otherCoord, otherIndex) {
      if (index !== otherIndex && areCoordinatesClose(coord, otherCoord, margin)) {
        return count + 1;
      }
      return count;
    }, 0);

    // Keep the coordinate if there are 0 or 1 close coordinates
    return closeCount <= 1;
  });

  return filteredCoordinates;
}

/* -------------------------------------------------------------------------
    IF TWO COORDINATES ARE VERY CLOSE TO EACH OTHER 
        IT REMOVES ONE FROM THE ARRAY
------------------------------------------------------------------------- */

function removeDuplicates(coordinates, margin) {

  // Iterate over each pair of coordinates
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const coord1 = coordinates[i];
      const coord2 = coordinates[j];

      // Calculate the distance between two coordinates
      const distance = Math.sqrt(
        Math.pow(coord2.v.x - coord1.v.x, 2) + Math.pow(coord2.v.y - coord1.v.y, 2)
      );

      // Check if the distance is less than the specified margin
      if (distance < margin) {
        // Remove one of the close coordinates (remove coord2 in this case)
        coordinates.splice(j, 1);

        // Decrement j to account for the removed element
        j--;
      }
    }
  }

  return coordinates;
}

function findMinMaxCoordinates(points) {
  if (points.length === 0) {
    return null; // Handle empty array case
  }

  let minX = points[0].v.x;
  let minY = points[0].v.y;
  let maxX = points[0].v.x;
  let maxY = points[0].v.y;

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    minX = Math.min(minX, point.v.x);
    minY = Math.min(minY, point.v.y);
    maxX = Math.max(maxX, point.v.x);
    maxY = Math.max(maxY, point.v.y);
  }

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
}

function findMinMaxCoordinatesHex(points) {
  if (points.length === 0) {
    return null; // Handle empty array case
  }

  let minX = points[0].position.x;
  let minY = points[0].position.y;
  let maxX = points[0].position.x;
  let maxY = points[0].position.y;

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    minX = Math.min(minX, point.position.x);
    minY = Math.min(minY, point.position.y);
    maxX = Math.max(maxX, point.position.x);
    maxY = Math.max(maxY, point.position.y);
  }

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  };
}

function getR(r) {
  return $fx.rand() * (-2 * r) + r;
}

shuffle = a => a.map((v, i) => a[a[i] = a[j = 0 | i + $fx.rand() * (a.length - i)], j] = v);
distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function interp(p1, p2, i) {
  return { x: p1.x * i + p2.x * (1 - i), y: p1.y * i + p2.y * (1 - i) }
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);

  ctx.lineWidth = 8

  ctx.stroke();
}

function interpolateHexColors(color1, color2, factor) {
  // Convert hex to RGB
  const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  // Interpolate between RGB values
  const interpolate = (val1, val2, factor) => val1 + (val2 - val1) * factor;

  // Get RGB values for each color
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Interpolate each RGB component
  const interpolatedRgb = rgb1.map((val, index) => {
    return Math.round(interpolate(val, rgb2[index], factor));
  });

  // Convert back to hex
  const interpolatedHex = rgbToHex(...interpolatedRgb);

  return interpolatedHex;
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
  // Ensure the value is within the initial range
  const clampedValue = Math.min(Math.max(value, fromMin), fromMax);

  // Calculate the percentage of the value within the initial range
  const percentage = (clampedValue - fromMin) / (fromMax - fromMin);

  // Map the percentage to the target range
  const mappedValue = toMin + percentage * (toMax - toMin);

  return mappedValue;
}

function darkenHexColor(hexColor, percentage) {
  // Ensure the percentage is between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Convert hex to RGB
  const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  // Darken each RGB component
  const darkenComponent = (value, percentage) => Math.round(value * (1 - percentage / 100));

  // Get RGB values for the original color
  const rgb = hexToRgb(hexColor);

  // Darken each RGB component
  const darkenedRgb = rgb.map(value => darkenComponent(value, clampedPercentage));

  // Convert back to hex
  const darkenedHex = rgbToHex(...darkenedRgb);

  return darkenedHex;
}