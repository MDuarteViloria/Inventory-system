import { Button, Heading, Input, Text } from "@medusajs/ui";
import { useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import { useNavigate } from "react-router-dom";
import api from "../Sources/Api";

export default function Login() {
  const { lang } = useContext(Contexts.langContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => setError(null), 5000);
  }, [error]);

  const handleLogin = async () => {
    let res;
    try {
      res = await api.post("/auth/login", {
        Username: username,
        Password: password,
      });
    } catch (e) {
      res = e;
      console.error(error);
    }

    if (res.status == 401) return setError(lang.login.badLogin);
    if (res.status != 200) return setError(lang.login.error);
    if (res.status == 200) navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 to-primary">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-gradient-to-t py-16 from-slate-100/90 to-white/90 shadow-xl p-10 flex flex-col rounded-md min-w-[300px] w-[30rem] max-w-[90%]"
      >
        <span className="m-auto">
          <box-icon color="#2a81a0" type="solid" size="100px" name="user-pin"></box-icon>
        </span>
        <Heading
          level="h1"
          className="flex items-end text-secondary brightness-50 gap-4 text-center m-auto"
        >
          {lang.login.title}
        </Heading>
        <Text className="text-red-500 leading-none h-8 flex items-center font-medium">
          {error && error}{" "}
        </Text>
        <Input
          onChange={(x) => setUsername(x.target.value)}
          placeholder={lang.login.labels.username}
          className="mb-5"
        />
        <Input
          onChange={(x) => setPassword(x.target.value)}
          placeholder={lang.login.labels.password}
          type="password"
        />
        <div className="[&_*]:transition-all">
          <Button
            disabled={!(password?.length >= 8 && username?.length > 0)}
            onClick={handleLogin}
            className="mt-5 disabled:cursor-not-allowed bg-gradient-to-r from-secondary to-primary hover:brightness-75 shadow-md w-full text-white"
            placeholder="Username"
          >
            <box-icon color="white" name="key" type="solid"></box-icon>
            {lang.login.button}
          </Button>
        </div>
      </form>
    </div>
  );
}
