import { useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState("jdoe@mail.com");
  const [password, setPassword] = useState("123456");
  const [checked, setChecked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  console.log(checked);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setConnected(true);
    }
  }, []);

  const handleSubmit = async () => {
    let response = "";
    if (checked) {
      response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
    } else {
      response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
    }

    if (response.ok) {
      const data = await response.json();
      setConnected(true);
      localStorage.setItem("token", data.token);
    } else {
      const error = await response.json();
      setConnected(false);
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setConnected(false);
    setCurrentUser(null);
  };

  const getCurrenctUser = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/my-account`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      },
    );
  };

  getCurrenctUser();

  return (
    <>
      <div style={{ marginTop: "40%", marginLeft: "40%" }}>
        {connected ? (
          <>
            <h1>Welcome back!</h1>
            <h2>{currentUser?.email}</h2>
            <button type={"submit"} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <h1>Please login</h1>
            <input
              type={"text"}
              name={"email"}
              placeholder={"Email"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type={"password"}
              name={"password"}
              placeholder={"Password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type={"checkbox"}
              name={"create"}
              checked={checked}
              onClick={() => setChecked(!checked)}
            />{" "}
            créer un comtpe
            <button type={"submit"} onClick={handleSubmit}>
              {checked ? "Créer" : "Login"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
