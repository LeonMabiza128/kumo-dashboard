import './globals.css';

export const metadata = {
  title: 'Kumo — Cloud Platform',
  description: 'Deploy your apps on South African infrastructure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
