export default async function selectImages() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  return new Promise((resolve) => {
    input.onchange = () => {
      resolve([...input.files]);
    };
    input.click();
  });
}