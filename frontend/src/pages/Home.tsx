import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Splash from "../animation/Splash";
import "../App.css";

function Home() {
  return (
    <Splash>
      <div className="app">
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </Splash>
  );
}

export default Home;
