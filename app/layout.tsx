// app/layout.tsx
import '@/app/ui/global.css';
export const metadata = {
    title: 'My Store',
    description: 'Buy the best products here',
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  