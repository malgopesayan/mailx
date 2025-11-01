import { Loader2 } from 'lucide-react';

// This is a small, inline spinner
export default function Spinner() {
  return <Loader2 className="animate-spin h-5 w-5 text-primary-blue" />;
}

// This is a full-page loader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="animate-spin h-8 w-8 text-primary-blue" />
    </div>
  );
}