// Implementing Quad Tree

const { transpileModule } = require("typescript");

class Point {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

/**
 *  ---------------------
 *           |
 *           |
 *           |
 *  ----------------------
 *
 */

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  contains(points) {
    return (
      points.x >= this.x - this.width / 2 &&
      points.x <= this.x + this.width / 2 &&
      points.y >= this.y - this.height / 2 &&
      points.y <= this.y + this.height / 2
    );
  }

  intersects(range) {
    return !(
      range.x - range.width / 2 > this.x + this.width / 2 ||
      range.x + range.width / 2 < this.x - this.width / 2 ||
      range.y - range.height / 2 > this.y + this.height / 2 ||
      range.y + range.height / 2 < this.y - this.height / 2
    );
  }
}

class QuadTree {
  constructor(boundary, capacity = 2, name = "ROOT") {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];

    this.divided = false;
    this.northEast = null;
    this.northWest = null;
    this.southEast = null;
    this.southWest = null;

    this.name = name;
  }

  subDivide() {
    const { x, y, height, width } = this.boundary;

    const halfHeight = height / 2;
    const halfWidth = width / 2;

    this.northWest = new QuadTree(
      new Rectangle(
        x - halfWidth / 2,
        y - halfHeight / 2,
        halfHeight,
        halfWidth,
      ),
      2,
      "NW",
    );

    this.northEast = new QuadTree(
      new Rectangle(
        x + halfWidth / 2,
        y - halfHeight / 2,
        halfHeight,
        halfWidth,
      ),
      2,
      "NE",
    );

    this.southWest = new QuadTree(
      new Rectangle(
        x - halfWidth / 2,
        y + halfHeight / 2,
        halfHeight,
        halfWidth,
      ),
      2,
      "SW",
    );

    this.southEast = new QuadTree(
      new Rectangle(
        x + halfWidth / 2,
        y + halfHeight / 2,
        halfHeight,
        halfWidth,
      ),
      2,
      "SE",
    );

    this.divided = true;

    const oldPoints = this.points;
    this.points = [];

    for (const point of oldPoints) {
      this.insert(point);
    }
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided && this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subDivide();
    }

    if (this.northWest.insert(point)) return true;
    if (this.northEast.insert(point)) return true;
    if (this.southWest.insert(point)) return true;
    if (this.southEast.insert(point)) return true;

    return false;
  }

  query(range, found = []) {
    if (!this.boundary.intersects(range)) {
      return found;
    }

    for (const point of this.points) {
      if (range.contains(point)) {
        found.push(point);
      }
    }

    if (this.divided) {
      this.northWest.query(range, found);
      this.northEast.query(range, found);
      this.southWest.query(range, found);
      this.southEast.query(range, found);
    }

    return found;
  }

  print(indent = "") {
    console.log(
      `${indent}${this.name} ` +
        `[${this.boundary.x}, ${this.boundary.y}, ` +
        `${this.boundary.width}x${this.boundary.height}]`,
    );

    if (this.points.length > 0) {
      console.log(
        `${indent}  Points: ${this.points
          .map((p) => `${p.name}(${p.x},${p.y})`)
          .join(", ")}`,
      );
    }

    if (this.divided) {
      this.northWest.print(indent + "  ");
      this.northEast.print(indent + "  ");
      this.southWest.print(indent + "  ");
      this.southEast.print(indent + "  ");
    }
  }

  radiusQuery(center, radius, found = []) {
    const range = new Rectangle(center.x, center.y, radius * 2, radius * 2);

    const candidates = this.query(range);

    for (const point of candidates) {
      const distance = Math.sqrt(
        (point.x - center.x) ** 2 + (point.y - center.y) ** 2,
      );
      if (distance <= radius) {
        found.push(point);
      }
    }

    return found;
  }
}


// 

const boundary = new Rectangle(
  50,   // center X
  50,   // center Y
  100,  // width
  100   // height
);

const tree = new QuadTree(boundary, 2);

const restaurants = [
  new Point(10, 10, "Restaurant A"),
  new Point(20, 20, "Restaurant B"),
  new Point(80, 10, "Restaurant C"),
  new Point(90, 20, "Restaurant D"),
  new Point(15, 15, "Restaurant E"),
  new Point(70, 70, "Restaurant F"),
  new Point(80, 80, "Restaurant G"),
];

for (const restaurant of restaurants) {
  tree.insert(restaurant);
}

tree.print();


const searchArea = new Rectangle(
  20,
  20,
  30,
  30
);

const results = tree.query(searchArea);

console.log(results);