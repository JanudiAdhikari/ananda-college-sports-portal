import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";
import ScrollToTopButton from "./components/layout/ScrollToTopButton";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-ananda-cream">
          <Navbar />

          <main className="flex-1">
            <AppRoutes />
          </main>

          <Footer />
          <ScrollToTopButton />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;