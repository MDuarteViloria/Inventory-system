import { createRoot } from "react-dom/client";
import "../../assets/App.css";

export default async function promptWithComponent(component) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  return await new Promise((resolve, reject) => {
    root.render(component(resolve));
  }).then((value) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);
    return value;
  });
}
