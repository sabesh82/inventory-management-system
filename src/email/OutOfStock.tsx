import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OutOfStockProps {
  dealer?: string;
  item?: string;
}

export const OutOfStock = ({ dealer, item = "" }: OutOfStockProps) => (
  <Html>
    <Head />
    <Preview>{item} has ran out of stock!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>
          <strong>@{dealer}</strong>, {item} has ran out of stock!.
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey <strong>{dealer}</strong>!
          </Text>
          <Text style={text}>
            Please be kind enough to send a fresh batch of this item {item}
          </Text>
        </Section>

        <Text style={footer}>
          Siddha Inventory | Sabesh wilson | EUSL TC IC 2019 COM 82
        </Text>
      </Container>
    </Body>
  </Html>
);

OutOfStock.PreviewProps = {
  dealer: "alanturing",
} as OutOfStockProps;

export default OutOfStock;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
