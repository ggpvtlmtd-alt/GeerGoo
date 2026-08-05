import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import SplashScreen from "../components/SplashScreen";
import "../App.css";

function Home() {
  return (
    <SplashScreen>
      <div className="app">
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </SplashScreen>
  );
}

export default Home;
