
import { createGlobalStyle } from "styled-components";
import { CartContextProvider } from "@/components/cartContext";
import Footer from "@/components/Footer";
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
        <CartContextProvider>
         {children}
         <Footer/>
        </CartContextProvider>
      </body>
    </html>
  );
}
