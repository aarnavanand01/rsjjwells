export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {children}
    </div>
  );
}
