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
    const { cartProducts, addProducts, removeProducts } = useContext(CartContext);
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
                      <Button onClick={()=>lessOfThisProduct(product._id)}>-</Button>
                      <QuantityLabel>
                      {getQuantity(product._id)}
                      </QuantityLabel> 
                      <Button onClick={()=>moreOfThisProduct(product._id)}>+</Button>
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

