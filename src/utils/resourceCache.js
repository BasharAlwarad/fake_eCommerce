import axios from 'axios';

/**
 * RENDER AS YOU FETCH PATTERN
 *
 * This utility starts data fetching IMMEDIATELY (not in useEffect)
 * The component will suspend (pause rendering) while data loads
 * This gives better UX because rendering doesn't have to wait
 */

// Simple cache to store promises for each API endpoint
const resourceCache = new Map();

/**
 * Creates a "resource" that suspends while data is loading
 *
 * @param {string} url - The API endpoint to fetch from
 * @returns {object} A resource object that either has data or suspends
 *
 * How it works:
 * 1. First call: Starts the fetch and stores the promise
 * 2. Returns the promise so the component suspends
 * 3. When data arrives: The data is stored and component can read it
 */
export function createResource(url) {
  // Return cached resource if we already started fetching this URL
  if (resourceCache.has(url)) {
    return resourceCache.get(url);
  }

  // Create a promise that fetches the data
  let data = null;
  let promise = axios
    .get(url)
    .then((response) => {
      // Store the data when fetch completes
      data = response.data;
      return response.data;
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    });

  // Create the resource object
  const resource = {
    // Read method - component calls this to get data
    read() {
      // If promise hasn't resolved yet, throw it (this causes Suspense)
      if (promise.status === 'pending') {
        throw promise;
      }
      // If we have data, return it
      if (data) {
        return data;
      }
      // If still loading, throw the promise
      throw promise;
    },
  };

  // Mark the promise status
  promise.status = 'pending';
  promise.then(
    () => {
      promise.status = 'fulfilled';
    },
    () => {
      promise.status = 'rejected';
    }
  );

  // Cache this resource so we don't fetch twice
  resourceCache.set(url, resource);

  return resource;
}

/**
 * Clear the cache if needed (e.g., for refresh button)
 */
export function clearResourceCache(url) {
  if (url) {
    resourceCache.delete(url);
  } else {
    resourceCache.clear();
  }
}
