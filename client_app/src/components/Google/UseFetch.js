import { useState } from "react";
// gg
const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async (response) => {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: response.credential }),
    })
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          localStorage.setItem("token", data?.user.token);
          localStorage.setItem("username", data?.user.username);
          window.location.href = "/";
        } else {
          throw new Error(data?.message || "Unknown error");
        }
      })
      .catch((error) => {
        setError(error?.message);
      });
  };

  return { loading, error, handleGoogle };
};

export default useFetch;
