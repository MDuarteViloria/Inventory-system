import { Container, Heading, Select } from "@medusajs/ui";
import Contexts from "../Sources/Contexts";
import { useContext } from "react";
import InputLabel from "./Subcomponents/Label";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { lang, setLang, user: { permissions } } = useContext(Contexts.langContext);
  const navigate = useNavigate();

  const headButtons = [
    {
      title: lang.settings.users,
      onClick: () => navigate("/users"),
      permission: "USUARIOS",
    },
    {
      title: lang.settings.images,
      onClick: () => navigate("/images"),
      permission: "IMAGENES",
    }
  ];

  const langs = [
    { label: "Español", value: "es" },
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
    { label: "奇诺", value: "zh" },
  ];

  const changeLang = (e) => {
    localStorage.setItem("lang", e);
    setLang(e);
  };

  return (
    <>
      <Container>
        <Heading level="h1">{lang.navPaths.settings}</Heading>
        <div className="flex flex-wrap my-8 gap-5 text-center">
          {headButtons.map((btn, index) => permissions?.map(x => x.name).includes(btn.permission) && (
            <Container
              onClick={btn.onClick}
              key={index}
              className="container-button min-w-1/2 w-1/3 flex-grow [&_*]:leading-none md:p-8 p-4"
            >
              <Heading
                className="text-gray-700 font-medium md:text-base text-sm"
                level="h2"
              >
                {btn.title}
              </Heading>
            </Container>
          ))}
        </div>
        <div className="w-[256px]">
          <InputLabel label={lang.settings.language}>
            <Select onValueChange={changeLang} defaultValue={lang.short}>
              <Select.Trigger>
                <Select.Value placeholder={lang.settings.language} />
              </Select.Trigger>
              <Select.Content>
                {langs.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </InputLabel>
        </div>
      </Container>
    </>
  );
}
