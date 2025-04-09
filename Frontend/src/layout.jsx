import "./globals.css"

export const metadata = {
  title: "Expense Management Dashboard",
  description: "Track and manage your expenses with ease",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
