import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Các thành phần chính
import AppAdmin from "./AppAdmin";
import Index from "./components/UserApp";
import Home from "./components/UserApp/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import News from "./components/UserApp/News";
import Contact from "./components/UserApp/Contact";
import Introduce from "./components/UserApp/Introduce";
import Messinger from "./components/UserApp/Messinger";
import SavedPosts from "./components/UserApp/SavedPosts";
import NotFound from "./components/NotFound";
import ChatBubble from "./components/UserApp/ChatBubble";

// Quản lý bài đăng và tài khoản người dùng
import PostNew from "./components/UserApp/PostComponent/PostNew";
import ManagerPost from "./components/UserApp/PostComponent/ManagerPost";
import UpdatePost from "./components/UserApp/PostComponent/UpdatePost";
import Changepassword from "./components/UserApp/PostComponent/Changepassword";
import Account from "./components/UserApp/PostComponent/Account";
import TransactionHistory from "./components/UserApp/PostComponent/TransactionHistory";
import FormUpgradePost from "./components/UserApp/PostComponent/formUpgradePost";

// Danh sách bài đăng
import PostHouse from "./components/UserApp/Post_list_component/PostHouse";
import PostRoomSale from "./components/UserApp/Post_list_component/PostRoomSale";
import PostApartment from "./components/UserApp/Post_list_component/PostApartment";
import PostRommate from "./components/UserApp/Post_list_component/PostRommate";
import PostDetail from "./components/UserApp/Post_list_component/PostDetail";
import PostProvince from "./components/UserApp/Post_list_component/PostProvince";

// Khác
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Payment from "./components/UserApp/Payment";

// ADMIN COMPONENTS
import HomeAdmin from "./components/AdminApp/HomeAdmin";
import ManagePost from "./components/AdminApp/ManagePosts";
import CategoryManagement from "./components/AdminApp/CategoryManagement";
import AccountAdmin from "./components/AdminApp/AccountAdmin";
import OrderManagement from "./components/AdminApp/OrderManagement";
import ProtectedRoute from "./components/ProtectedRoute";

// Tích hợp Stripe
const stripePromise = loadStripe(
  "pk_test_51QIXc5Gui79K0O8g32wUjEQt6TXJTUp8jxVyKk1HupexrNJaqrfCDbJiWrH7sSfA1iaL9b6EDXVXr2YgAYNc3DgV00sReAVhS"
);

const root = ReactDOM.createRoot(document.getElementById("root"));

// Role người dùng từ localStorage
// const role = parseInt(localStorage.getItem('Role')) ||2;

const role = JSON.parse(localStorage.getItem("role"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          {/* ROUTES NGƯỜI DÙNG */}
          <Route path="/" element={<Index />}>
            <Route index element={<Home />} />
            <Route path="dang-nhap" element={<Login />} />
            <Route path="dang-ky" element={<Register />} />
            <Route path="tin-tuc" element={<News />} />
            <Route path="lien-he" element={<Contact />} />
            <Route path="gioi-thieu" element={<Introduce />} />
            <Route path="nhan-tin" element={<Messinger />} />
            <Route path="tin-da-luu" element={<SavedPosts />} />
            <Route path="chat/:chatId" element={<ChatBubble />} />

            {/* QUẢN LÝ BÀI ĐĂNG */}
            <Route path="dang-tin" element={<PostNew />} />
            <Route path="quan-li-tin-dang" element={<ManagerPost />} />
            <Route path="chinh-sua-tin-dang/:id" element={<UpdatePost />} />
            <Route path="nang-cap-tin-dang/:id" element={<FormUpgradePost />} />

            {/* DANH SÁCH BÀI ĐĂNG */}
            <Route path="cho-thue-nha-o" element={<PostHouse />} />
            <Route path="cho-thue-phong-tro" element={<PostRoomSale />} />
            <Route path="cho-thue-can-ho" element={<PostApartment />} />
            <Route path="tim-nguoi-o-ghep" element={<PostRommate />} />
            <Route path="chi-tiet-bai-dang/:id" element={<PostDetail />} />
            <Route
              path="lay-danh-sach-bai-dang-theo-tinh"
              element={<PostProvince />}
            />

            {/* TÀI KHOẢN NGƯỜI DÙNG */}
            <Route path="doi-mat-khau" element={<Changepassword />} />
            <Route path="tai-khoan" element={<Account />} />
            <Route
              path="transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="payment" element={<Payment />} />

            {/* RESET PASSWORD */}
            <Route path="dat-lai-mat-khau" element={<ForgotPassword />} />
            <Route
              path="cap-nha-lai-mat-khau/:token"
              element={<ResetPassword />}
            />

            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ROUTES ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role={role}>
                <AppAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeAdmin />} />
            <Route path="quan-ly-bai-dang" element={<ManagePost />} />
            <Route path="quan-ly-danh-muc" element={<CategoryManagement />} />
            <Route path="quan-ly-tai-khoan" element={<AccountAdmin />} />
            <Route path="don-hang" element={<OrderManagement />} />
          </Route>
        </Routes>
      </Elements>
    </BrowserRouter>
  </React.StrictMode>
);
