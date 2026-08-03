import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import "../App.css";

function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
