import { createGlobalStyle } from "styled-components";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
const GlobalStyles = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en suppressHydrationWarning">
      <body>
        <GlobalStyles />
        <Providers>
        {children}
        <Footer />
      </Providers>
      </body>
    </html>
  );
}
