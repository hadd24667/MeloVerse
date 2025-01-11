#  Lưu ý

- public : chứa hình ảnh,vv
 ## src/
### - assets/: Chứa các tệp tài nguyên như hình ảnh, font, và các tệp media
### - components/ : Các thành phần cần tách rời (nếu page nào không cần thiết chia thành phần thì bỏ qua) 
**thường thì những gì ược tái sử dụng mới chia components
### - contexts/: Chứa các context để quản lý state toàn cục bằng React Context API (cái này BE)
### - hooks/: Chứa các custom hooks giúp tách biệt logic có thể tái sử dụng trong các thành phần khác nhau (khó dùng vl)
### - pages/ : đại diện cho các route (ví dụ route "/login" tương ứng vs LoginPage) cái này thường dùng để tổng hợp các components con thành 1 trang hoặc viết thêm nếu cần thiết
### - utils/ : chứa tiện ích tạm thời chưa đụng
### - App.js : cấu hình Router và các thành phần chính trong đây
### - Main.js : tạm thời chưa dùng tới


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
