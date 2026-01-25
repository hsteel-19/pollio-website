export default function PresentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No sidebar for presenter view - fullscreen presentation
  return <>{children}</>
}
