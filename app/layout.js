import './globals.css';

export const metadata = {
  title: 'ToDo App',
  description: 'A simple, beginner-friendly ToDo app built with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
