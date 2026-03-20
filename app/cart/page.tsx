// "use client";

// import styled from "styled-components";
// import Center from "@/components/Center";
// import Header from "@/components/header";
// import Button from "@/components/Button";
// import { useContext, useEffect, useState } from "react";
// import { CartContext } from "@/components/cartContext";
// import Table from "@/components/Table";
// import Input from "@/components/Input";
// import { useSearchParams } from "next/navigation";

// const ColumnsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1.2fr 0.8fr;
//   gap: 40px;
//   margin-top: 40px;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Box = styled.div`
//   background: #fff;
//   border-radius: 12px;
//   padding: 20px;
// `;

// const ProductRow = styled.td`
//   display: flex;
//   align-items: center;
//   gap: 12px;
// `;

// const ProductImage = styled.div`
//   width: 70px;
//   height: 70px;
//   border: 1px solid #eee;
//   border-radius: 10px;
//   padding: 6px;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   img {
//     max-width: 100%;
//     max-height: 100%;
//   }
// `;

// const ProductName = styled.div`
//   font-weight: 500;
// `;

// const QuantityBox = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 6px;
// `;

// const QtyButton = styled.button`
//   width: 28px;
//   height: 28px;
//   border: 1px solid #ddd;
//   background: #fff;
//   cursor: pointer;
//   border-radius: 6px;

//   &:hover {
//     background: #f5f5f5;
//   }
// `;

// const QtyNumber = styled.span`
//   min-width: 20px;
//   text-align: center;
// `;

// const Remove = styled.span`
//   color: red;
//   cursor: pointer;
//   font-size: 12px;

//   &:hover {
//     text-decoration: underline;
//   }
// `;

// const TotalRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 12px;
//   font-weight: 500;
// `;

// const CityHolder = styled.div`
//   display: flex;
//   gap: 5px;
// `;

// export default function CartPage() {
//   const {
//     cartProducts,
//     addProducts,
//     removeProducts,
//     clearCart,
//   } = useContext(CartContext);

//   const [products, setProducts] = useState([]);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [city, setCity] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [streetAddress, setStreetAddress] = useState("");
//   const [country, setCountry] = useState("");

//   const searchParams = useSearchParams();
//   const success = searchParams.get("success");

//   // 👉 fetch products
//   useEffect(() => {
//     async function fetchProducts() {
//       if (!cartProducts?.length) {
//         setProducts([]);
//         return;
//       }

//       if (success) {
//         clearCart();
//       }

//       const res = await fetch("/api/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ids: cartProducts }),
//       });

//       const data = await res.json();
//       setProducts(data);
//     }

//     fetchProducts();
//   }, [cartProducts, success]);

//   const getQuantity = (id) => {
//     return cartProducts.filter((p) => p === id).length;
//   };

//   const moreOfThisProduct = (id) => addProducts(id);
//   const lessOfThisProduct = (id) => removeProducts(id);

//   const productMap = {};
//   products.forEach((p) => {
//     productMap[p._id] = p;
//   });

//   let total = 0;
//   for (const id of cartProducts) {
//     total += productMap[id]?.price || 0;
//   }

//   async function checkout() {
//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       body: JSON.stringify({
//         name,
//         email,
//         city,
//         postalCode,
//         streetAddress,
//         country,
//         products: cartProducts.join(","),
//       }),
//     });

//     const data = await res.json();
//     if (data.url) {
//       window.location = data.url;
//     }
//   }

//   if (success) {
//     return (
//       <>
//         <Header />
//         <Center>
//           <Box>
//             <h1>Thanks for your order!</h1>
//             <p>We will email you when your order will be sent.</p>
//           </Box>
//         </Center>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <Center>
//         <ColumnsWrapper>
//           {/* CART */}
//           <Box>
//             <h2>Shopping Cart</h2>

//             {!cartProducts?.length && <p>Your cart is empty</p>}

//             {products.length > 0 && (
//               <>
//                 <Table>
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th style={{ textAlign: "center" }}>Qty</th>
//                       <th style={{ textAlign: "right" }}>Total</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {products.map((p) => (
//                       <tr key={p._id}>
//                         <ProductRow>
//                           <ProductImage>
//                             <img src={p.images[0]} />
//                           </ProductImage>
//                           <div>
//                             <ProductName>{p.title}</ProductName>
//                             <Remove
//                               onClick={() =>
//                                 removeProducts(p._id)
//                               }
//                             >
//                               Remove
//                             </Remove>
//                           </div>
//                         </ProductRow>

//                         <td style={{ textAlign: "center" }}>
//                           <QuantityBox>
//                             <QtyButton
//                               onClick={() =>
//                                 lessOfThisProduct(p._id)
//                               }
//                             >
//                               -
//                             </QtyButton>

//                             <QtyNumber>
//                               {getQuantity(p._id)}
//                             </QtyNumber>

//                             <QtyButton
//                               onClick={() =>
//                                 moreOfThisProduct(p._id)
//                               }
//                             >
//                               +
//                             </QtyButton>
//                           </QuantityBox>
//                         </td>

//                         <td style={{ textAlign: "right" }}>
//                           $
//                           {getQuantity(p._id) * p.price}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>

//                 <TotalRow>
//                   <span>Total</span>
//                   <span>${total}</span>
//                 </TotalRow>
//               </>
//             )}
//           </Box>

//           {/* ORDER */}
//           {!!cartProducts?.length && (
//             <Box>
//               <h2>Order Information</h2>

//               <Input
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />

//               <Input
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <CityHolder>
//                 <Input
//                   placeholder="City"
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                 />
//                 <Input
//                   placeholder="Postal Code"
//                   value={postalCode}
//                   onChange={(e) =>
//                     setPostalCode(e.target.value)
//                   }
//                 />
//               </CityHolder>

//               <Input
//                 placeholder="Street Address"
//                 value={streetAddress}
//                 onChange={(e) =>
//                   setStreetAddress(e.target.value)
//                 }
//               />

//               <Input
//                 placeholder="Country"
//                 value={country}
//                 onChange={(e) =>
//                   setCountry(e.target.value)
//                 }
//               />

//               <Button primary block onClick={checkout}>
//                 Continue to payment
//               </Button>
//             </Box>
//           )}
//         </ColumnsWrapper>
//       </Center>
//     </>
//   );
// }
"use client";

import styled from "styled-components";
import Center from "@/components/Center";
import Header from "@/components/header";
import Button from "@/components/Button";
import { use, useContext, useEffect } from "react";
import { useState } from "react";
import { CartContext } from "@/components/cartContext";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { useSearchParams } from "next/navigation";


const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex flex-column;
  align-items: center;
  justify-content: center;
`;
const ProductInfoCell = styled.td`
  padding: 10px 0;
`
const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  display: flex;
  items-center: center;
  justify-content: center;
  border-radius: 10px;
  img{
  max-width: 80px;
  max-height: 80px;
}
`
const QuantityLabel = styled.span`
padding: 0 3px;
`
const CityHolder = styled.div`
display: flex;
gap: 5px;
`
export default function CartPage() {
    const { cartProducts, addProducts, removeProducts, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState(""); 
    const [postalCode, setPostalCode] = useState("");
    const [streetAddress, setStreetAddress] = useState(""); 
    const [country, setCountry] = useState(""); 

    const searchParams=useSearchParams();
    const success=searchParams.get("success");
    // 👉 fetch products theo ids trong cart
    useEffect(() => {
      async function fetchProducts() {
        if (!cartProducts?.length) {
          setProducts([]);
          return;
        }
        if(success){
          clearCart();
        }
  
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: cartProducts }),
        });
  
        const data = await res.json();
        setProducts(data);
      }
  
      fetchProducts();
    }, [cartProducts]);
  
    // 👉 helper: đếm số lượng sản phẩm
    const getQuantity = (id) => {
      return cartProducts.filter((productId) => productId === id).length;
    };  
    const moreOfThisProduct = (id) => {
      // 👉 thêm 1 sản phẩm vào cart
      addProducts(id);
    }
    const lessOfThisProduct = (id) => {
      removeProducts(id);
    }
    const productMap = {};

    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    let total = 0;

    for (const productId of cartProducts) {
      total += Number(productMap[productId]?.price || 0);
    }
    async function checkout() {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          city,
          postalCode,
          streetAddress,
          country,
          products: cartProducts.join(","),
        }),
      });
      const data = await res.json();
      if(data.url){
        window.location = data.url;
      }
    }
    if(success){
      return (
        <>
          <Header />
          <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
          </Center>
        </>
      )
    }
      return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>Your cart is empty</div>
            )}

            {products.length > 0 && (
              <>
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th >Quantity</th>
                      <th >Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title} 
                      </ProductInfoCell>
                      <td>
                      <Button outline onClick={()=>lessOfThisProduct(product._id)}>-</Button>
                      <QuantityLabel>
                      {getQuantity(product._id)}
                      </QuantityLabel> 
                      <Button primary onClick={()=>moreOfThisProduct(product._id)}>+</Button>
                      </td>
                      <td>
                     
                        ${getQuantity(product._id) * product.price}
                      
                      </td>
                    </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td><b>Total:</b></td>
                      <td><b>${total}</b></td>
                    </tr>
                  </tbody>
                </Table>
                
              </>
            )}
          </Box>
            {!!cartProducts?.length && (
          <Box>
            <h2>Order information:</h2>
            <Input 
              placeholder="Name:" 
              name="name"
              value={name}
              onChange={ev=>setName(ev.target.value)}/>
            <Input 
              type="text"
              placeholder="Email:" 
              name="email"
              value={email}
              onChange={ev=>setEmail(ev.target.value)}/>
            <CityHolder>
              <Input 
                type="text"
                placeholder="City:" 
                name="city"
                value={city}
                onChange={ev=>setCity(ev.target.value)}/>
              <Input 
                type="text"
                placeholder="Postal Code:" 
                name="postalCode"
                value={postalCode}
                onChange={ev=>setPostalCode(ev.target.value)}/>
            </CityHolder>
            <Input 
              type="text"
              placeholder="Street Adress:" 
              name="streetAddress"
              value={streetAddress}
              onChange={ev=>setStreetAddress(ev.target.value)}/>
            <Input 
              type="text"
              placeholder="Country:" 
              name="country"
              value={country}
              onChange={ev=>setCountry(ev.target.value)}/>
            <input 
              type="hidden" 
              name="cartProducts" 
              value={cartProducts.join(",")} />
            <Button block primary onClick={checkout}>Continue to payment</Button>
          </Box>
        )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}

