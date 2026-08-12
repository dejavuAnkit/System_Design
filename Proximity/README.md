# Quad Tree for Proximity Search

This project demonstrates how a Quad Tree can be used to efficiently search nearby points in a 2D space.

## What is a Quad Tree?

A Quad Tree is a tree data structure where each node represents a rectangular region. If that region contains more points than a defined capacity, it splits into four child quadrants:

- North West (NW)
- North East (NE)
- South West (SW)
- South East (SE)

This helps reduce the number of points checked during searches, especially when working with a large number of locations.

## Why use it for proximity search?

In real-world mapping and delivery systems, we often need to answer questions like:

- Which restaurants are near me?
- Which cabs are available within a 2km radius?
- Which stores are inside a given search area?

Instead of checking every point in a dataset, a quad tree narrows the search to only the relevant regions. This makes lookup much faster as the number of points grows.

## How this code works

The file `quad_tree.js` contains:

- `Point`: represents a location with x and y coordinates and a name
- `Rectangle`: represents a 2D area
- `QuadTree`: inserts points and searches within a range

### Insert operation

Each point is inserted into the tree. If the current region is full, the region is subdivided into four smaller sections and points are pushed down into the correct child node.

### Query operation

The `query(range)` method searches all points inside a rectangular area. This is useful for fetching nearby locations quickly.

### Radius-based search

The `radiusQuery(center, radius)` method finds points within a certain distance from a center point. It does this by forming a bounding rectangle around the circle and then filtering the candidate points using Euclidean distance.

## Example

The code creates a set of restaurant points and then queries for all points in a rectangular area:

```javascript
const searchArea = new Rectangle(20, 20, 30, 30);
const results = tree.query(searchArea);
console.log(results);
```

This is the core idea behind location-based search: instead of scanning all restaurants, only the relevant area is checked.

## Real-world usage

Quad trees are used in many location-based and geospatial applications, including:

- restaurant and store discovery
- map rendering
- nearest-neighbour search
- game collision detection
- GPS and delivery optimization

Applications like Swiggy, Zomato, Uber, and food delivery platforms use similar spatial indexing ideas to:

- find restaurants near a customer
- filter by delivery radius
- rank results by distance
- optimize search for locality and convenience

These apps usually use more advanced geospatial data structures and services in production, but the core concept is the same: partition space to search only the relevant nearby regions.

## Summary

Quad trees are a great fit for proximity search because they reduce the number of comparisons and help applications respond faster when users search for locations nearby.

This project is a simple implementation to understand the underlying idea behind real-world location search systems.
