import HomePage from "./pages/HomePage";
import Container from "./components/layout/Container";
import { Routes, Route } from "react-router";
import NotFoundPage from "./pages/NotFoundPage";
import SiteHeader from "./components/layout/SiteHeader";
import AlgorithmsPage from "./pages/Algorithms";

function App() {
  return (
    <>
      <SiteHeader />
      <main className="pt-28 pb-16">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
