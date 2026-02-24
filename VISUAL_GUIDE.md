# Visual Guide: Render As You Fetch Pattern

## Flow Diagram

```
START APP
   |
   ↓
─────────────────────────────────────────────
│ App.jsx Loads                            │
│                                          │
│ const productsResource = createResource()│
│ ⚡ FETCH STARTS HERE!                    │
└─────────────────────────────────────────────
   |
   ↓
┌─────────────────────────────────────────────┐
│ SUSPENSE BOUNDARY                           │
│ <Suspense fallback={<Loading />}>          │
│                                             │
│  Is data ready? → NO                        │
│                ↓                            │
│           Show Loading Screen ⏳            │
│                |                            │
│                ↓ (meanwhile, fetch finishes)
│                                             │
│   Is data ready? → YES                      │
│                ↓                            │
│           ProductsList renders    ✨        │
└─────────────────────────────────────────────┘
   |
   ↓
─────────────────────────────────────────────
│ ProductsList.jsx                         │
│                                          │
│ const data = productsResource.read() ✅  │
│                                          │
│ <div>                                    │
│   {data.map(product => (                │
│     <ProductCard {...} />               │
│   ))}                                    │
│ </div>                                   │
└─────────────────────────────────────────────
```

---

## Timeline Comparison

### ❌ Fetch on Render (Old)

```
Time →

T0: Component renders
    └─→ Shows "Loading..."

T1: Component mounted
    └─→ useEffect runs
    └─→ Fetch starts

T2: Data arrives
    └─→ setData() called
    └─→ Re-render

T3: Products displayed
    └─→ User sees content

⏱️  TOTAL TIME: Component renders, then waits, then data comes
```

### ✅ Render As You Fetch (New)

```
Time →

T0: Fetch starts
    └─→ createResource() called in App

T1: Component mounts (data still loading)
    └─→ resource.read() called
    └─→ Throws promise

T2: Suspense catches promise
    └─→ Shows Loading...

T3: Data arrives
    └─→ Promise resolves

T4: Component tries again
    └─→ resource.read() returns data

T5: Products displayed
    └─→ User sees content

⏱️  TOTAL TIME: Same, but fetch started earlier!
     Better perceived performance
```

---

## State of Each Component

```
┌──────────────────────────────────────────────────────────┐
│ App.jsx                                                  │
│ ─────────────────────────────────────────────────────── │
│ productsResource: Promise (loading) → Object (data)    │
│ cartList: []                                             │
│                                                          │
│ Does it manage data? YES (resource)                      │
│ Does it fetch? YES (via createResource)                  │
│ Does it render? NO (just routes)                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ProductsList.jsx                                         │
│ ─────────────────────────────────────────────────────── │
│ productsResource: (received from App)                   │
│ setCartList: (received from App)                         │
│                                                          │
│ Does it manage data? NO                                  │
│ Does it fetch? NO                                        │
│ Does it render? YES (displays products)                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Cart.jsx                                                 │
│ ─────────────────────────────────────────────────────── │
│ cartList: [ {product}, {product}, ... ]                  │
│ setCartList: (received from App)                         │
│                                                          │
│ Does it manage data? NO                                  │
│ Does it fetch? NO                                        │
│ Does it render? YES (displays cart items)                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ProductCard.jsx                                          │
│ ─────────────────────────────────────────────────────── │
│ product: { id, title, price, ... }                       │
│ setCartList: (from App, passed through ProductsList)   │
│                                                          │
│ Does it manage data? NO                                  │
│ Does it fetch? NO                                        │
│ Does it render? YES (displays single product)            │
└──────────────────────────────────────────────────────────┘
```

---

## The Promise Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ PROMISE STATES                                              │
└─────────────────────────────────────────────────────────────┘

axios.get(url)
  ↓
┌─────────────────────┐
│ status: 'pending'   │
│                     │
│ resource.read()     │
│       ↓             │
│  if (pending)       │
│    throw promise    │ ← Suspense catches!
│                     │
└─────────────────────┘
  ↓
[Network request in progress...]
  ↓
[Response arrives]
  ↓
┌─────────────────────────────┐
│ status: 'fulfilled'        │
│ data: { products: [...] }  │
│                             │
│ resource.read()             │
│       ↓                     │
│  if (data)                  │
│    return data ← Component renders!
│                             │
└─────────────────────────────┘
```

---

## Reading Data vs Fetching Data

```
┌──────────────────────────────────────────────────────────────┐
│ FETCHING (happens in App.jsx)                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  const productsResource = createResource(url)                │
│                                                               │
│  Inside createResource():                                    │
│    let promise = axios.get(url)     ← Network request!      │
│    return resource { read() }                                │
│                                                               │
│  STATUS: Network is active, fetching from server            │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ READING (happens in ProductsList.jsx)                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  const products = productsResource.read()                    │
│                                                               │
│  Inside resource.read():                                     │
│    if (promise.status === 'pending')                         │
│      throw promise  ← Suspense catches this!                 │
│    if (data)                                                 │
│      return data    ← We have data!                          │
│                                                               │
│  STATUS: No network request here, just reading cached data   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
<BrowserRouter>
  │
  ├─ <Nav cartList={cartList} />
  │   ├─ Display cart count
  │   └─ Link to /cart
  │
  └─ <ErrorBoundary>
      │
      └─ <Routes>
          │
          ├─ Route: "/"
          │   └─ <Suspense fallback={<Loading />}>
          │       └─ <ProductsList productsResource={resource} />
          │           └─ <ProductCard ... />
          │               └─ <ProductCard ... />
          │               └─ <ProductCard ... />
          │
          ├─ Route: "/cart"
          │   └─ <Cart cartList={cartList} />
          │       └─ <ProductCard ... /> (cart items)
          │
          └─ Route: "*" (not found)
              └─ <NotFound />
```

---

## Where Errors Happen

```
┌──────────────────────────────────────────────────────────┐
│ ERROR SCENARIO 1: Network Error                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ createResource() fetch:                                  │
│   .catch(error => throw error)  ← Error thrown here     │
│         ↓                                                 │
│   ErrorBoundary catches it  ← Shows error UI             │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ERROR SCENARIO 2: Component Error                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ProductsList renders:                                    │
│   data.map(product => <ProductCard ... />)              │
│   └─ ProductCard throws error                            │
│         ↓                                                 │
│   ErrorBoundary catches it  ← Shows error UI             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Decision Tree: When to Use Which Pattern

```
                        Do I need data?
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ↓                       ↓
            Can it wait?          Will multiple components
         (fetching takes 2-3s)      need same data?
             │                        │
        NO ←─┴─→ YES             NO ←─┴─→ YES
         │        │               │        │
         │        │               │        ↓
         │        ↓               │   Is it simple
         │    Is it simple?       │   to fetch?
         │    (< 100 lines)       │
         │        │               │
         │    YES ←─→ NO          │
         │    │        │           │
         │    │        ↓           │
         │    │    Use React      ↓
         │    │    Query or   Use Render
         │    │    SWR        As You Fetch
         │    │                  ↓
         │    │     ┌───────────────────────┐
         │    └────→│ Render As You Fetch ✓ │
         │          └───────────────────────┘
         │
         └─→ Use Fetch on Render
            (only for rare edge cases)
```

---

## Memory Visual: How Resource Works

```
BEFORE FETCH:
┌─────────────────────────────┐
│ resourceCache Map           │
│ ┌───────────────────────┐   │
│ │ (empty)               │   │
│ └───────────────────────┘   │
└─────────────────────────────┘

FIRST CALL TO createResource():
┌─────────────────────────────────────────┐
│ resourceCache Map                       │
│ ┌───────────────────────────────────┐   │
│ │ "https://api/products" →          │   │
│ │   {                               │   │
│ │     data: null,                   │   │
│ │     promise: Promise (pending),   │   │
│ │     read() { ... }                │   │
│ │   }                               │   │
│ └───────────────────────────────────┘   │
│                                         │
│ FETCH IS HAPPENING IN BACKGROUND ⚡    │
└─────────────────────────────────────────┘

WHEN FETCH COMPLETES:
┌──────────────────────────────────────────────┐
│ resourceCache Map                            │
│ ┌────────────────────────────────────────┐   │
│ │ "https://api/products" →               │   │
│ │   {                                    │   │
│ │     data: [ {product}, {product}... ], │   │
│ │     promise: Promise (fulfilled),      │   │
│ │     read() { return data; }            │   │
│ │   }                                    │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ DATA IS READY! ✓                             │
└──────────────────────────────────────────────┘

SECOND CALL TO createResource():
Returns the SAME resource from cache
No new fetch! ⏱️ Instant data!
```

---

## One Page Summary

```
╔═══════════════════════════════════════════════════════════════╗
║                  RENDER AS YOU FETCH                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  1. APP.jsx          Creates resource (fetch starts)          ║
║     ↓                                                         ║
║  2. SUSPENSE         Wraps component with loading fallback    ║
║     ↓                                                         ║
║  3. COMPONENT        Reads data from resource                 ║
║     ↓                                                         ║
║  4. DATA READY?      YES → Render   NO → Show Loading        ║
║                                                               ║
║  CATCH ERRORS?       ErrorBoundary catches and shows UI      ║
║                                                               ║
║  RESULT: Clean, fast, scalable data loading!                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```
