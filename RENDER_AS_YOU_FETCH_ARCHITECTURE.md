# Render As You Fetch Pattern - Architecture Overview

## Project Structure for Render As You Fetch

```
src/
├── App.jsx                    ← 🚀 FETCH STARTS HERE
├── components/
│   ├── Nav.jsx               (presentational)
│   ├── ProductCard.jsx        (presentational)
│   ├── ErrorBoundary.jsx      ← 🛡️ ERROR HANDLING
│ └── pages/
│   ├── ProductsList.jsx       ← 📖 READS DATA (suspends if needed)
│   ├── Cart.jsx               (uses state from App)
│   └── NotFound.jsx           (static)
└── utils/
    └── resourceCache.js       ← 🎁 RESOURCE UTILITY
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ App.jsx                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1. CREATE RESOURCE (fetch starts immediately)      │ │
│ │    const productsResource = createResource(URL)    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Suspense Boundary (in App)                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 2. WRAP with Suspense                              │ │
│ │    Shows: <LoadingScreen /> while data loads       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ProductsList.jsx                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3. READ DATA (if not ready, component suspends)    │ │
│ │    const data = productsResource.read()            │ │
│ │                                                     │ │
│ │    If data ready → render products                 │ │
│ │    If data loading → throw (Suspense catches)      │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## The resourceCache.js Utility

This is the key to the pattern. Here's how it works:

```jsx
createResource(url)
    ↓
    Creates a promise that fetches data
    ↓
    Returns a resource object with read()
    ↓
    read() either throws promise or returns data
    ↓
    Suspense catches thrown promises
    ↓
    Component renders when data is ready
```

### The Promise Lifecycle

```javascript
// 1. Promise created (status: 'pending')
let promise = axios.get(url)

// 2. If component calls read() before promise resolves
resource.read() → throws promise → Suspense catches → shows fallback

// 3. Promise resolves and stores data
promise.then(() => { data = response.data; promise.status = 'fulfilled' })

// 4. Component retries and calls read()
resource.read() → returns data → component renders
```

---

## Why This Is Better for Teaching

### Before: Fetch on Render

- Hard to understand when fetch happens
- Multiple state variables (loading, error, data)
- Conditional rendering for loading states
- Dependency array confusion

### After: Render As You Fetch

✅ Clear: Fetch in App, read in component  
✅ Simple: Just one resource to pass  
✅ Automatic: Suspense handles loading UI  
✅ Predictable: Data flow is always the same

---

## Key Concepts for Students

### 1. Resource Pattern

A "resource" is an object that:

- Holds a promise that's loading data
- Has a `read()` method
- Returns data OR throws promise

### 2. Suspense

A React component that:

- Catches thrown promises
- Shows `fallback` UI while waiting
- Re-renders component when promise resolves

### 3. Error Boundary

A React component that:

- Catches JS errors
- Shows error UI
- Prevents whole app from crashing

---

## Common Misconceptions

**❌ "Suspense is async/await"**
✅ No! Suspense catches thrown promises, not async code

**❌ "Component should create the resource"**
✅ No! Parent (App) creates it, then passes down

**❌ "We need useEffect in ProductsList"**
✅ No! Fetch-on-render pattern doesn't apply here

**❌ "resource.read() makes an API call"**
✅ No! API call started in App, read() just returns data

---

## Mini Challenges for Students

1. **Try this:** Comment out the fetch in App and see what happens (component suspends forever)
2. **Try this:** Add a second resource for categories API
3. **Try this:** Create a cache clear button
4. **Try this:** Add a timeout message after 5 seconds
5. **Try this:** Make fetch happen on user click, not on app load

---

## Debugging Tips

When teaching, if students see infinite loading:

- Check if fetch is starting (Network tab)
- Check if resource is being passed correctly
- Check if components are wrapped in Suspense

If component renders but shows no data:

- Check if resource.read() is being called
- Check if API returned correct data
- Check browser Console for errors

---

## This Pattern In The Wild

This pattern is used by:

- **React Router v6.4+** (with loaders)
- **Next.js** (with Server Components)
- **SWR** and **React Query** (with Suspense)
- **Relay** (Facebook's data fetching)

Your students are learning modern React! 🎓
