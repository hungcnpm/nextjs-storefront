"use client";
import styled, { css } from "styled-components";
import { useState } from "react";

type ImageButtonProps = {
    $active?: boolean;
  };
const Image = styled.img`
max-width: 100%;
max-height: 100%;`
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`
const BigImage = styled.img`
    max-width: 100%;
    max-height: 200px;`
const BigImageWrapper = styled.div`
    text-align: center;
`
const ImageButton = styled.div<ImageButtonProps>`
    border: 2px solid #aaa;
    height: 40px;
    padding: 2px;
    cursor: pointer;
    border-radius: 5px;
    ${({ $active })  =>
    !$active &&
    css`
      background-color: transparent;
      opacity: 0.5;
    `}
    ${({ $active }) =>
      $active &&
    css`
      background-color: red;
    `}
`;
export default function ProductImages({
    images,
  }: {
    images: string[];
  }) {
    const[activeImage, setActiveImage] = useState(images[0]);
    return (
        <>
        <BigImageWrapper>
            <BigImage src={activeImage}/>
        </BigImageWrapper>
        <ImageButtons >  
          {images.map((image, index) => (
            <ImageButton 
            $active={image===activeImage} 
            key={index} onClick={() => 
            setActiveImage(image)}> 
              <Image src={image} alt="/"/>
            </ImageButton>
        ))}
        </ImageButtons>
        </>
    );
  }