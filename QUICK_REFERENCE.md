# Google Maps Loader - Quick Reference

## 📦 Import

```typescript
import { googleMapsLoader } from '@/lib/google-map-api-loader';
import { GOOGLE_MAPS_API_KEY } from '@/configs/constants';
```

---

## 🚀 Quick Start

```typescript
// Load and use
const google = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);

// Check if loaded
if (googleMapsLoader.isLoaded()) {
  // Ready to use
}
```

---

## 📚 Complete API

### `load(apiKey, options?)`

Load Google Maps JavaScript API.

```typescript
const google = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY, {
  libraries: ['places', 'drawing'],
  language: 'en',
  region: 'US',
});
```

**Returns:** `Promise<GoogleMapsAPI>`

---

### `isLoaded()`

Check if Google Maps is already loaded.

```typescript
const loaded = googleMapsLoader.isLoaded();
```

**Returns:** `boolean`

---

### `wait()`

Wait for an in-progress load to complete.

```typescript
const google = await googleMapsLoader.wait();
```

**Returns:** `Promise<GoogleMapsAPI>`

**Throws:** Error if no load is in progress

---

### `getScript()`

Get the existing script element.

```typescript
const script = googleMapsLoader.getScript();
console.log(script?.src);
```

**Returns:** `HTMLScriptElement | null`

---

### `createScript(url)`

Create and append a script tag (advanced use).

```typescript
const script = googleMapsLoader.createScript('https://example.com/script.js');
```

**Returns:** `HTMLScriptElement`

---

### `dispose()`

Clean up all resources (useful for hot reload).

```typescript
googleMapsLoader.dispose();
```

**Returns:** `void`

---

### `buildUrl(apiKey, options?)`

Build a properly formatted Google Maps URL.

```typescript
const url = googleMapsLoader.buildUrl(GOOGLE_MAPS_API_KEY, {
  libraries: ['places'],
  language: 'ja',
  region: 'JP',
});
```

**Returns:** `string`

---

## 🎨 Load Options

```typescript
type LoadOptions = {
  libraries?: string[]; // ['places', 'drawing', 'geometry', etc.]
  language?: string; // 'en', 'ja', 'es', etc.
  region?: string; // 'US', 'JP', 'GB', etc.
};
```

### Available Libraries

- `places` - Places API
- `drawing` - Drawing tools
- `geometry` - Geometry utilities
- `visualization` - Data visualization
- `marker` - Advanced markers

[Full list →](https://developers.google.com/maps/documentation/javascript/libraries)

---

## ⚡ Common Patterns

### React Hook

```typescript
function useGoogleMaps() {
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    googleMapsLoader.load(GOOGLE_MAPS_API_KEY).then(setGoogle);
  }, []);

  return google;
}
```

### TanStack Router Loader

```typescript
export const Route = createFileRoute('/map')({
  loader: () => googleMapsLoader.load(GOOGLE_MAPS_API_KEY),
});
```

### Check Before Use

```typescript
if (!googleMapsLoader.isLoaded()) {
  await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);
}
// Now safe to use
```

---

## ⚠️ Important Notes

### Browser Only

This service only works in browser environments. For SSR:

```typescript
if (typeof window !== 'undefined') {
  await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);
}
```

### Hot Reload (Dev)

```typescript
// In React useEffect cleanup:
return () => {
  if (import.meta.env.DEV) {
    googleMapsLoader.dispose();
  }
};
```

### API Key Security

Never commit API keys! Use environment variables:

```bash
# .env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## 🔍 Type Safety

For full type safety, install Google Maps types:

```bash
npm install -D @types/google.maps
```

Then cast as needed:

```typescript
const google = await googleMapsLoader.load(GOOGLE_MAPS_API_KEY);
const typedGoogle = google as typeof window.google;
const map = new typedGoogle.maps.Map(element, options);
```

---

## 📖 Full Documentation

- **Usage Examples:** `GOOGLE_MAPS_LOADER_USAGE.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Code Examples:** `src/lib/google-map-api-loader.example.ts`

---

## 🐛 Troubleshooting

### "Failed to load Google Maps script"

- Check your API key is valid
- Verify you have enabled Maps JavaScript API in Google Cloud Console
- Check browser console for specific error messages

### Multiple script tags appearing

- Use `dispose()` before reloading
- Ensure you're using the singleton instance

### TypeScript errors with `google` object

- Install `@types/google.maps`
- Use type assertions as shown above

---

**Version:** 1.0.0  
**License:** MIT  
**Browser Support:** All modern browsers (ES6+)
