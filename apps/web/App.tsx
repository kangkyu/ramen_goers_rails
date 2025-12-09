import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Toaster } from "@fusion/ui/sonner";
import Index from "./pages/Index";
import MyVisits from "./pages/MyVisits";
import Rankings from "./pages/Rankings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-visits" element={<MyVisits />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
