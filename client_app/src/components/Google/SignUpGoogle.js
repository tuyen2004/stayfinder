import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "./UseFetch";
// gg
const SignUpGoogle = () => {
  const navigate = useNavigate();
  const { handleGoogle, loading, error } = useFetch(
    "http://localhost:8000/api/auth/signupGoogle"
  );

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          await handleGoogle(response);
          navigate("/dang-nhap", {
            state: {
              message: "Tài khoản bạn đã đăng ký. Vui lòng đăng nhập!",
            },
          });
        },
      });

      google.accounts.id.renderButton(document.getElementById("signUpDiv"), {
        theme: "filled_black",
        text: "continue_with",
        shape: "pill",
      });

      // google.accounts.id.prompt();
    }
  }, [handleGoogle, navigate]);

  return (
    <>
      <nav style={{ padding: "2rem" }}>
        <Link to="/">Go Back</Link>
      </nav>
      <header style={{ textAlign: "center" }}></header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div id="signUpDiv" data-text="signup_with"></div>
        )}
      </main>
      <footer></footer>
    </>
  );
};

export default SignUpGoogle;
