import "./../../App.css";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import ChatProvider from "./ChatContext";
import ChatBubble from "./ChatBubble";
import { UserProvider } from "./UserContext";

function Index() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthPage =
    location.pathname === "/dang-nhap" || location.pathname === "/dang-ky";

  return (
    <UserProvider>
      <ChatProvider>
        <div>
          {!isAuthPage && <Header />}
          <main>
            <Outlet />
            {token && <ChatBubble />}
          </main>
          {!isAuthPage && <Footer />}
        </div>
      </ChatProvider>
    </UserProvider>
  );
}

export default Index;
