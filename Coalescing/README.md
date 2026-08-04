# Coalescing: Handling Burst Search Requests

This folder demonstrates a coalescing-based solution for the "celebrity" or hot-key problem where many users send the same search request at the same time.

## Problem

When 10,000 requests arrive for the same search query, the system may repeatedly perform the same expensive work, such as:
- hitting the database
- calling an external service
- recomputing the same result

This leads to unnecessary load, higher latency, and wasted resources.

## Solution

The coalescing pattern avoids duplicate work by ensuring that only one request performs the expensive operation while other requests share the same in-flight result.

### How it works

1. The first request for a given search key starts the work.
2. Other requests for the same key while it is in progress are grouped together.
3. They wait for the same result instead of triggering new computation.
4. Once the first request completes, all the waiting requests receive the same response.

## Why this helps

This reduces:
- repeated backend calls
- duplicated computation
- cache stampede behavior
- overall latency under burst traffic

## Use case

This pattern is especially useful for:
- popular search keywords
- frequently requested APIs
- hot cache keys
- systems experiencing request spikes

In short, coalescing ensures that a burst of 10,000 identical requests is handled efficiently by converting many redundant operations into one shared execution.
