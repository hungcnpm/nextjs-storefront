import UserNavBar from "@/components/UserNavBar";
import Header from "@/components/header";
import styled from "styled-components";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Wrapper>
        <Container>
          <Left>
            <UserNavBar />
          </Left>
          <Right>{children}</Right>
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  gap: 20px;
`;

const Left = styled.div`
  width: 250px;
`;

const Right = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;