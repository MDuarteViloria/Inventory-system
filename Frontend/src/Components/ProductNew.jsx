import { useContext } from "react";
import Contexts from "../Sources/Contexts";
import { Heading, Container } from "@medusajs/ui";

export default function ProductNew() {
  const lang = useContext(Contexts.langContext);
  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.products.createProductHeader}</Heading>
      </Container>
    </div>
  );
}
