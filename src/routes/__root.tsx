import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { APIProvider } from '@/components/map';
import { GOOGLE_MAPS_API_KEY } from '@/configs/constants';
import { Button } from '@/components/ui/button';

const RootLayout = () => (
  <APIProvider
    apiKey={GOOGLE_MAPS_API_KEY || ''}
    libraries={['places', 'drawing', 'geometry']}
  >
    <div className="p-2 flex gap-2 items-center h-16 border-b">
      <Button asChild variant="link">
        <Link to="/" className="[&.active]:font-bold [&.active]:bg-primary/10">
          Home
        </Link>
      </Button>
      <Button asChild variant="link">
        <Link
          to="/about"
          className="[&.active]:font-bold [&.active]:bg-primary/10"
        >
          About
        </Link>
      </Button>
    </div>
    <Outlet />
    <TanStackRouterDevtools />
  </APIProvider>
);

export const Route = createRootRoute({ component: RootLayout });
