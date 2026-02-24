# Render As You Fetch - A Teaching Guide

## What is "Render As You Fetch"?

**Render As You Fetch** means: "Start fetching data BEFORE the component tries to render it, so data is ready when needed."

This is the **modern React pattern** used by frameworks like NextJS and recommended by the React team. It's better than "Fetch on Render" because:

- Data loading starts earlier (no waiting for component to mount)
- Better perceived performance
- Clearer data flow in the app

---

## Key Difference: Fetch on Render vs. Render As You Fetch

### ❌ Fetch on Render (Old Pattern)

```jsx
function Component() {
  const [data, setData] = useState([]);

  // Wait for component to render, THEN start fetching
  useEffect(() => {
    fetch('/api').then((res) => setData(res));
  }, []);
}
```

**Problem:** Component renders, then sees no data, then fetches. Slow!

### ✅ Render As You Fetch (Modern Pattern)

```jsx
// App.jsx - Start fetch FIRST
const dataResource = createResource('/api');

// ProductsList.jsx - Component READS the already-loading data
function ProductsList({ dataResource }) {
  const data = dataResource.read(); // Suspends if not ready
  return <div>{data}</div>;
}

// App.jsx - Suspense catches the suspension and shows loading
<Suspense fallback={<Loading />}>
  <ProductsList dataResource={dataResource} />
</Suspense>;
```

**Benefit:** Fetch starts immediately, component suspends if needed, better flow!

---

## The Three Parts of This Pattern

### 1. **Resource Utility** (`src/utils/resourceCache.js`)

Creates a "resource" that holds the promise and data:

```jsx
const resource = createResource('https://api.example.com/data');
```

This utility:

- **Starts the fetch immediately** (not in useEffect!)
- **Caches the promise** so we don't fetch twice
- **Provides a `read()` method** that either returns data or throws the promise

### 2. **Suspense Boundary** (in `App.jsx`)

Wraps components and catches when they suspend:

```jsx
<Suspense fallback={<LoadingScreen />}>
  <ProductsList dataResource={dataResource} />
</Suspense>
```

When ProductsList calls `dataResource.read()` and data isn't ready:

1. The promise is thrown
2. Suspense catches it
3. LoadingScreen appears
4. When data arrives, ProductsList renders

### 3. **Component Reads Data** (in `ProductsList.jsx`)

Simple: just call `resource.read()`

```jsx
function ProductsList({ dataResource }) {
  // If data is ready: returns data
  // If data is loading: throws promise (Suspense catches it)
  const products = dataResource.read();

  return <div>{products.map(...)}</div>;
}
```

---

## How It Works in This Project

### 🚀 Step 1: App Starts Fetch Immediately

**File:** `src/App.jsx` (top of component)

```jsx
// When App.jsx loads, fetch STARTS RIGHT AWAY
// No waiting for the user to navigate to the Products page
const productsResource = createResource('https://fakestoreapi.com/products');
```

### ⏳ Step 2: Suspense Wraps the Component

**File:** `src/App.jsx` (in Routes)

```jsx
<Suspense fallback={<LoadingScreen message="Loading products..." />}>
  <ProductsList productsResource={productsResource} />
</Suspense>
```

If ProductsList suspends (data not ready), Suspense shows the fallback.

### 📖 Step 3: Component Reads the Data

**File:** `src/pages/ProductsList.jsx`

```jsx
function ProductsList({ productsResource }) {
  // This is all we need! No useState, no useEffect
  const productsList = productsResource.read();

  return <div>{/* render products */}</div>;
}
```

---

## The Resource Utility Explained

This is the magic that makes render-as-you-fetch work:

```jsx
// Create and cache the fetch promise
const resource = {
  read() {
    // If promise isn't done, throw it (causes Suspense)
    if (promise.status === 'pending') {
      throw promise; // Suspense catches this!
    }
    // If promise is done, return the data
    return data;
  },
};
```

**Why throw the promise?**

- It's how React knows "this component can't render yet"
- Suspense catches thrown promises and waits for them
- When the promise resolves, the component tries again and gets the data

---

## Error Handling

Errors are caught by the **ErrorBoundary** component:

```jsx
<ErrorBoundary>
  <Routes>
    <Route path="/" element={...} />
    {/* If ProductsList throws an error, ErrorBoundary catches it */}
  </Routes>
</ErrorBoundary>
```

---

## No More useEffect for Data!

Notice: **ProductsList has NO useEffect!**

```jsx
// ❌ NOT NEEDED ANYMORE
useEffect(() => {
  fetch('/api').then(setData);
}, []);

// ✅ JUST READ FROM RESOURCE
const data = dataResource.read();
```

This is much simpler for students to understand!

---

## Component Types in This Project

| Component        | Fetches? | Why                                 |
| ---------------- | -------- | ----------------------------------- |
| **ProductsList** | No ❌    | Reads from resource in App          |
| **Cart**         | No ❌    | Gets data from App state (props)    |
| **ProductCard**  | No ❌    | Just displays product info          |
| **Nav**          | No ❌    | Just displays cart count from props |

All data fetching happens in **App.jsx**, not in child components!

---

## Student Questions & Answers

**Q: Why throw the promise?**
A: It's React's way of saying "I can't render yet, wait for this promise." Suspense listens for thrown promises.

**Q: Why cache the resource?**
A: So we don't fetch the same data multiple times. If 5 components need products, we only fetch once.

**Q: What if I navigate to /products after going to /cart?**
A: The resource is already cached, so data is instant! No refetch needed.

**Q: How is this better than useEffect?**
A: Fetch starts immediately, not after component mounts. Better performance and clearer data flow.

**Q: Can the component handle loading state itself?**
A: No! That's the point. Suspense handles loading centrally. Cleaner code!

---

## Teaching Tips

1. **Show the flow:** App → fetch starts → Suspense → Loading screen → ProductsList renders
2. **Compare patterns:** Pull up old fetch-on-render code and show the difference
3. **Explain throwing:** "It's weird but it's React's way of pausing rendering"
4. **Live code:** Make students add another data source and wrap it in Suspense
5. **Browser DevTools:** Show Network tab when it loads - fetch starts immediately!

---

## Extended Ideas for Students

1. Add a refresh button that clears the cache and refetches
2. Fetch another API (categories, reviews, etc.)
3. Show data loading in parallel for multiple resources
4. Add query parameters and refetch when they change
5. Implement pagination with render-as-you-fetch
6. Compare performance metrics with old fetch-on-render approach

---

## Key Takeaways

✅ Fetch starts in **App.jsx** before rendering  
✅ Component **suspends** if data isn't ready  
✅ **Suspense** shows loading UI while waiting  
✅ **ErrorBoundary** catches errors  
✅ **No useEffect** for data fetching in this pattern  
✅ **Cleaner, more predictable** data flow

This is the future of React data fetching! 🚀
