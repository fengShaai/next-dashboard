import { inter } from '@/app/ui/fonts'; // global font
import { title } from 'process';
import Footer from '@/components/storeFront/footer';
import Header from '@/components/storeFront/header';

export const metadata = {
  title: 'Compuwork',
  description: 'Compuwork is a platform for selling laptops and accessories',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body> 
    </html>
  );
}