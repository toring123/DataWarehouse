import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      {/* Logo */}
      <Link href="/">
          Logo
      </Link>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "24px" }}>
        <Link href="/about">Giới thiệu</Link>
        <Link href="/services">Dịch vụ</Link>
        <Link href="/contact">Liên hệ</Link>
      </nav>

      {/* Button */}
      <Link href="/login">
          <button style={{
            padding: "8px 20px",
            borderRadius: "6px",
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            Đăng nhập
          </button>
      </Link>
    </div>
  );
};

export default Header;
