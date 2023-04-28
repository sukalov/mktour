
import './globals.css'

export const metadata = {
  title: 'mktour',
  description: 'an app for organazing complex tournament brackets of all kind',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body>{children}</body>
      </html>
  )
}
