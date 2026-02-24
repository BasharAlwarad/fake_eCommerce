# Render As You Fetch - Quick Reference for Students

## The Simple Version

**Traditional (Slow):**

1. Component renders
2. Component says "oh no, no data!"
3. Component fetches data
4. Data arrives
5. Component re-renders

**Render As You Fetch (Fast):**

1. App fetches data before rendering
2. Component renders with data ready
3. Done!

---

## Three Files You Need to Understand

### 1️⃣ `src/utils/resourceCache.js`

**What it does:** Creates a "resource" that holds your fetching data

**Key function:**

```javascript
const productsResource = createResource('https://api.example.com/products');
```

**What happens inside:**

- Fetch starts immediately
- Data is cached (won't fetch twice)
- Provides a `read()` method

---

### 2️⃣ `src/App.jsx`

**What it does:** Starts the fetch and passes resource to components

**Key code:**

```jsx
// 1. Start fetch
const productsResource = createResource('URL');

// 2. Wrap component with Suspense
<Suspense fallback={<LoadingScreen />}>
  <ProductsList productsResource={productsResource} />
</Suspense>;
```

---

### 3️⃣ `src/pages/ProductsList.jsx`

**What it does:** Reads the data from resource

**Key code:**

```jsx
function ProductsList({ productsResource, setCartList }) {
  // That's it!
  const products = productsResource.read();

  return <div>{/* render products */}</div>;
}
```

---

## The Magic: How Suspense Works

```
ProductsList calls: productsResource.read()
                    ↓
Is data ready?  → YES  → Return data → Render
                ↓
              NO → Throw promise
                    ↓
            Suspense catches promise
                    ↓
            Show LoadingScreen
                    ↓
    Promise resolves (data arrives)
                    ↓
            Try ProductsList.read() again
                    ↓
              Data is ready now!
                    ↓
              Render ProductsList
```

---

## Important Differences

| What?                       | Fetch on Render                     | Render as You Fetch               |
| --------------------------- | ----------------------------------- | --------------------------------- |
| **Where fetch starts?**     | In component (useEffect)            | In App (top level)                |
| **When fetch starts?**      | After component renders             | Before component renders          |
| **How do we show loading?** | `if (isLoading) return <Loading />` | `<Suspense fallback=<Loading />>` |
| **Component code**          | Complex (3+ states)                 | Simple (just read data)           |
| **Performance**             | Slower                              | Faster                            |

---

## The Absolute Minimum Code

```jsx
// App.jsx - START FETCH
const resource = createResource('URL');

// App.jsx - WRAP WITH SUSPENSE
<Suspense fallback={<Loading />}>
  <Component resource={resource} />
</Suspense>;

// Component.jsx - READ DATA
const data = resource.read();
```

That's it! 🎉

---

## When to Use This Pattern

✅ Use when:

- Multiple components need the same data
- You want loading UI managed centrally
- You're building modern React apps
- Data doesn't change frequently

❌ Don't use for:

- Real-time data (chat, notifications)
- User interactions (search, filters)
- Forms and input validation

---

## Common Mistakes

❌ **Mistake:** Trying to handle loading in the component

```jsx
const data = resource.read();
if (!data) return <Loading />; // Won't work!
```

✅ **Fix:** Use Suspense instead

```jsx
<Suspense fallback={<Loading />}>
  <ProductsList resource={resource} />
</Suspense>
```

---

❌ **Mistake:** Creating resource inside the component

```jsx
function ProductsList() {
  const resource = createResource(URL); // Every render = new fetch!
  return ...
}
```

✅ **Fix:** Create in App

```jsx
const resource = createResource(URL); // Created once in App
function ProductsList({ resource }) { ... }
```

---

## Try These

1. **Trace the data:** Follow the data from API → resource → component → screen
2. **Break it:** Comment out the Suspense and see what breaks
3. **Add loading time:** Add `setTimeout` in resource and watch Suspense work
4. **Create another resource:** Add categories and fetch those too
5. **Check Network tab:** See how fetch starts when App loads, not when you click

---

## One Sentence Summary

**Fetch in App, read in component, Suspense shows loading.**

That's render-as-you-fetch! 🚀
