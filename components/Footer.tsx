"use client";

import styled from "styled-components";
import Center from "./Center";

const FooterWrapper = styled.footer`
  background: #f5f5f5;
  margin-top: 60px;
  border-top: 1px solid #ddd;
`;

const Section = styled.div`
  padding: 40px 0;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Title = styled.h3`
  font-size: 12px;
  font-weight: 500;`
const Column = styled.div`
  font-size: 13px;
  display: flex;
  flex-direction: column;

  Title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
    min-height: 32px; /* 🔥 giữ title thẳng hàng */
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  a {
    color: #555;
    text-decoration: none;

    white-space: nowrap; /* 🔥 không xuống dòng */
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #ee4d2d;
    }
  }
`;

const IconGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const Icon = styled.img`
  height: 26px;
  width: auto;
`;

const SocialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SocialIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const AppBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const QR = styled.img`
  width: 80px;
  height: 80px;
`;

const AppLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
`;

const AppImg = styled.img`
  width: 70px;
`;

const Bottom = styled.div`
  border-top: 1px solid #ddd;
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: #777;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Center>
        <Section>
          <Columns>
            {/* Customer */}
            <Column>
              <Title>DỊCH VỤ KHÁCH HÀNG</Title>
              <div className="content">
                <a>Trung tâm trợ giúp</a>
                <a>Hướng dẫn mua hàng</a>
                <a>Thanh toán</a>
                <a>Vận chuyển</a>
                <a>Trả hàng & hoàn tiền</a>
              </div>
            </Column>

            {/* About */}
            <Column>
              <Title>VỀ CHÚNG TÔI</Title>
              <div className="content">
                <a>Giới thiệu</a>
                <a>Tuyển dụng</a>
                <a>Điều khoản</a>
                <a>Chính sách bảo mật</a>
              </div>
            </Column>

            {/* Payment */}
            <Column>
              <Title>THANH TOÁN</Title>
              <div className="content">
                <IconGrid>
                  <Icon src="/images/payment/visa.png" />
                  <Icon src="/images/payment/mastercard.png" />
                  <Icon src="/images/payment/momo.png" />
                  <Icon src="/images/payment/zalopay.png" />
                </IconGrid>

                <Title style={{ marginTop: 16 }}>VẬN CHUYỂN</Title>
                <IconGrid>
                  <Icon src="/images/shipping/ghn.png" />
                  <Icon src="/images/shipping/stripe.png" />
                </IconGrid>
              </div>
            </Column>

            {/* Social */}
            <Column>
              <Title>THEO DÕI SHOP</Title>
              <div className="content">
                <SocialItem>
                  <SocialIcon src="/images/social/facebook.png" />
                  Facebook
                </SocialItem>
                <SocialItem>
                  <SocialIcon src="/images/social/instagram.png" />
                  Instagram
                </SocialItem>
                <SocialItem>
                  <SocialIcon src="/images/social/linkedin.png" />
                  LinkedIn
                </SocialItem>
              </div>
            </Column>

            {/* App */}
            <Column>
              <Title>TẢI ỨNG DỤNG</Title>
              <div className="content">
                <AppBox>
                  <QR src="/images/qr.png" />
                  <AppLinks>
                    <AppImg src="/images/appstore.png" />
                    <AppImg src="/images/googleplay.png" />
                  </AppLinks>
                </AppBox>
              </div>
            </Column>
          </Columns>
        </Section>

        <Bottom>
          © {new Date().getFullYear()} Ecommerce. All rights reserved.
        </Bottom>
      </Center>
    </FooterWrapper>
  );
}