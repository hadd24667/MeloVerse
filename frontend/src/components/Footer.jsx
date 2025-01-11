import React from 'react';
import '../styles/Footer.css';


const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-md-left">
            <h3>Meloverse</h3>
            <p>Ngôi nhà âm nhạc của bạn – Trải nghiệm âm nhạc đỉnh cao với Meloverse.</p>
          </div>
          <div className="col-md-6 text-md-right">
            <h4>Liên Hệ</h4>
            <p>Email: support@meloverse.vn</p>
            <p>Hotline: 0123-456-789</p>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copyright">
          &copy; 2024 Meloverse. Đồ án cơ sở 2 bởi Phan Hữu Quốc Hạnh - 23IT.B050 và Trần Văn Hiếu - 23IT.B057, lớp 23GITB, Trường CNTT&TT Việt Hàn.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
