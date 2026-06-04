import "./globals.css";

export const metadata = {
  title: "FlowSpend",
  description: "Mini Expense Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
