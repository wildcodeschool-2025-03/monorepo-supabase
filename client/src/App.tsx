import { useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState("jdoe@mail.com");
  const [password, setPassword] = useState("123456");
  const [checked, setChecked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [addTitle, setAddTitle] = useState("");

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

    if (response.ok) {
      const data = await response.json();
      setCurrentUser(data);
    } else {
      const error = await response.json();
      console.log(error);
    }
  };

  const getItems = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      setItems(data);
    } else {
      const error = await response.json();
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrenctUser();
    getItems();
  }, []);

  const handleUpdate = async (item) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/${item.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ title }),
      },
    );

    if (response.ok) {
      await response.json();
      getItems();
    } else {
      const error = await response.json();
      console.log(error);
    }
    setIsEdit(false);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setTitle(item.title);
  };
  const handleDelete = async (item) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/${item.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      getItems();
    } else {
      const error = await response.json();
      console.log(error);
    }
  };

  const handleNew = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ title: addTitle, user_id: currentUser.id }),
    });

    if (response.ok) {
      await response.json();
      getItems();
    } else {
      const error = await response.json();
      console.log(error);
    }
    setIsEdit(false);
    setIsAdd(false);
  };

  return (
    <>
      <div style={{ marginTop: "40%", marginLeft: "40%" }}>
        {connected ? (
          <>
            <h1>Welcome back!</h1>
            <button onClick={() => (isAdd ? handleNew() : setIsAdd(true))}>
              {isAdd ? "Sauvegarder" : "Ajouté"}
            </button>
            {isAdd && (
              <input
                type={"text"}
                name={"addTitle"}
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
              />
            )}

            <ul>
              {items.map((item) => (
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    {isEdit ? (
                      <input
                        type={"text"}
                        name={"title"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    ) : (
                      item.title
                    )}{" "}
                  </div>
                  <button
                    onClick={() =>
                      isEdit ? handleUpdate(item) : handleEdit(item)
                    }
                  >
                    {isEdit ? "Sauvegarder" : "Modifier"}
                  </button>
                  <button onClick={() => handleDelete(item)}>Supprimer</button>
                </li>
              ))}
            </ul>
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
