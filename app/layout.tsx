import './globals.css'

export const metadata = {
  title: 'The Grudgekeeper',
  description: 'Space Dwarf Roguelike',
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