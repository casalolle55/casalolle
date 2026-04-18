// Root layout intentionally minimal — the [locale]/layout.tsx renders <html>/<body>
// This is the recommended pattern for next-intl with Next.js App Router
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
