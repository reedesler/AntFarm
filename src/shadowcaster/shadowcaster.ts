export default class ShadowCaster {
  // Takes a circle in the form of a center point and radius, and a function that
  // can tell whether a given cell is opaque. Calls the setFoV action on
  // every cell that is both within the radius and visible from the center.

  public static computeFieldOfViewWithShadowCasting(
    x: number,
    y: number,
    radius: number,
    isOpaque: (x: number, y: number) => boolean,
    setFoV: (x: number, y: number) => void
  ) {
    const opaque = ShadowCaster.translateOrigin(isOpaque, x, y);
    const fov = ShadowCaster.translateOrigin(setFoV, x, y);

    for (let octant = 0; octant < 8; ++octant) {
      ShadowCaster.computeFieldOfViewInOctantZero(
        ShadowCaster.translateOctant(opaque, octant),
        ShadowCaster.translateOctant(fov, octant),
        radius
      );
    }
  }

  private static computeFieldOfViewInOctantZero(
    isOpaque: (x: number, y: number) => boolean,
    setFieldOfView: (x: number, y: number) => void,
    radius: number
  ) {
    const queue: ColumnPortion[] = [];
    const columnPortion: ColumnPortion = {
      x: 0,
      bottomVector: {
        x: 1,
        y: 0,
      },
      topVector: {
        x: 1,
        y: 1,
      },
    };
    queue.push(columnPortion);
    while (queue.length !== 0) {
      const current = queue.shift();
      if (!current) break;
      if (current.x > radius) continue;

      ShadowCaster.computeFoVForColumnPortion(
        current.x,
        current.topVector,
        current.bottomVector,
        isOpaque,
        setFieldOfView,
        radius,
        queue
      );
    }
  }

  // This method has two main purposes: (1) it marks points inside the
  // portion that are within the radius as in the field of view, and
  // (2) it computes which portions of the following column are in the
  // field of view, and puts them on a work queue for later processing.
  private static computeFoVForColumnPortion(
    x: number,
    topVector: DirectionVector,
    bottomVector: DirectionVector,
    isOpaque: (x: number, y: number) => boolean,
    setFieldOfView: (x: number, y: number) => void,
    radius: number,
    queue: ColumnPortion[]
  ) {
    // Search for transitions from opaque to transparent or
    // transparent to opaque and use those to determine what
    // portions of the *next* column are visible from the origin.

    // Start at the top of the column portion and work down.

    let topY;
    if (x === 0) {
      topY = 0;
    } else {
      const quotient = Math.floor(((2 * x + 1) * topVector.y) / (2 * topVector.x));
      const remainder = ((2 * x + 1) * topVector.y) % (2 * topVector.x);

      if (remainder > topVector.x) {
        topY = quotient + 1;
      } else {
        topY = quotient;
      }
    }

    // Note that this can find a top cell that is actually entirely blocked by
    // the cell below it; consider detecting and eliminating that.

    let bottomY;
    if (x === 0) {
      bottomY = 0;
    } else {
      const quotient = Math.floor(((2 * x - 1) * bottomVector.y) / (2 * bottomVector.x));
      const remainder = ((2 * x - 1) * bottomVector.y) % (2 * bottomVector.x);

      if (remainder >= bottomVector.x) {
        bottomY = quotient + 1;
      } else {
        bottomY = quotient;
      }
    }

    // A more sophisticated algorithm would say that a cell is visible if there is
    // *any* straight line segment that passes through *any* portion of the origin cell
    // and any portion of the target cell, passing through only transparent cells
    // along the way. This is the "Permissive Field Of View" algorithm, and it
    // is much harder to implement.

    let wasLastCellOpaque: boolean | null = null;
    for (let y = topY; y >= bottomY; --y) {
      const inRadius = ShadowCaster.isInRadius(x, y, radius);
      if (inRadius) {
        // The current cell is in the field of view.
        setFieldOfView(x, y);
      }

      // A cell that was too far away to be seen is effectively
      // an opaque cell; nothing "above" it is going to be visible
      // in the next column, so we might as well treat it as
      // an opaque cell and not scan the cells that are also too
      // far away in the next column.

      const currentIsOpaque = !inRadius || isOpaque(x, y);
      if (wasLastCellOpaque != null) {
        if (currentIsOpaque) {
          // We've found a boundary from transparent to opaque. Make a note
          // of it and revisit it later.
          if (!wasLastCellOpaque) {
            // The new bottom vector touches the upper left corner of
            // opaque cell that is below the transparent cell.
            queue.push({
              x: x + 1,
              bottomVector: {
                x: x * 2 - 1,
                y: y * 2 + 1,
              },
              topVector,
            });
          }
        } else if (wasLastCellOpaque) {
          // We've found a boundary from opaque to transparent. Adjust the
          // top vector so that when we find the next boundary or do
          // the bottom cell, we have the right top vector.
          //
          // The new top vector touches the lower right corner of the
          // opaque cell that is above the transparent cell, which is
          // the upper right corner of the current transparent cell.
          topVector = { x: x * 2 + 1, y: y * 2 + 1 };
        }
      }
      wasLastCellOpaque = currentIsOpaque;
    }

    // Make a note of the lowest opaque-->transparent transition, if there is one.
    if (wasLastCellOpaque != null && !wasLastCellOpaque) {
      queue.push({ x: x + 1, bottomVector, topVector });
    }
  }

  private static isInRadius(x: number, y: number, length: number) {
    return Math.max(x, y) <= length;
  }

  // Octant helpers
  //
  //
  //                 \2|1/
  //                 3\|/0
  //               ----+----
  //                 4/|\7
  //                 /5|6\
  //
  //

  private static translateOrigin<T>(f: (x: number, y: number) => T, x: number, y: number) {
    return (a: number, b: number) => f(a + x, b + y);
  }

  private static translateOctant<T>(f: (x: number, y: number) => T, octant: number) {
    switch (octant) {
      default:
        return f;
      case 1:
        return (x: number, y: number) => f(y, x);
      case 2:
        return (x: number, y: number) => f(-y, x);
      case 3:
        return (x: number, y: number) => f(-x, y);
      case 4:
        return (x: number, y: number) => f(-x, -y);
      case 5:
        return (x: number, y: number) => f(-y, -x);
      case 6:
        return (x: number, y: number) => f(y, -x);
      case 7:
        return (x: number, y: number) => f(x, -y);
    }
  }
}

interface ColumnPortion {
  x: number;
  bottomVector: DirectionVector;
  topVector: DirectionVector;
}

interface DirectionVector {
  x: number;
  y: number;
}
