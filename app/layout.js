import './globals.css';

export const metadata = {
  title: 'Full Relish',
  description: "What's in season today",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
