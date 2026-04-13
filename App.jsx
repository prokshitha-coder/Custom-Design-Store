import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { getApiBaseUrl } from "./api";
import  DesignsPage from "./pages/DesignsPage";
import { OrderPage } from "./pages/OrderPage";

function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">CD</span>
            <span>
              <strong>Custom Design Store</strong>
              <small>Simple React frontend</small>
            </span>
          </Link>
          <span className="api-pill">API: {getApiBaseUrl()}</span>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<Layout />}>
          <Route index element={<DesignsPage />} />
          <Route path="/order/:designId" element={<OrderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
