import { Brain, Shield, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Analyze massive log files using advanced AI models and surface hidden issues in seconds, not hours.",
  },
  {
    icon: Shield,
    title: "Security Detection",
    description:
      "Detect suspicious activities, intrusion attempts, and security threats before they become critical.",
  },
  {
    icon: BarChart3,
    title: "Smart Reports",
    description:
      "Generate clean, detailed reports with severity classification and actionable insights for your team.",
  },
  {
    icon: Zap,
    title: "Error Tracking",
    description:
      "Automatically detect application errors, performance bottlenecks, and root causes with suggested fixes.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <span className="features-label">Features</span>
        <h2>Everything you need to debug faster</h2>
        <p className="features-subtitle">
          GeerGoo combines AI-powered analysis with developer-friendly tools
          so you can identify, understand, and resolve issues at scale.
        </p>
      </div>

      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="feature-card" key={title}>
            <div className="feature-icon">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
