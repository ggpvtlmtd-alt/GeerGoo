import { Brain, Shield, BarChart3, Zap, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Autonomous AI Diagnostics",
    description:
      "Parse voluminous stack traces and syslogs. Our contextual models isolate root causes and suggest source-level fixes instantly.",
    size: "large",
  },
  {
    icon: Shield,
    title: "Proactive Security Audits",
    description:
      "Track system privilege escalations, failed authentications, and traffic anomalies to prevent breaches before they spread.",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Insight Analytics",
    description:
      "Aggregate telemetry and generate production health audits. Map error frequencies and latency offsets over time.",
    size: "small",
  },
  {
    icon: Zap,
    title: "Low-latency Diagnostics",
    description:
      "Process log streams in sub-second intervals. Ingest, parse, and categorize security logs with zero infrastructure overhead.",
    size: "large",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <span className="features-label">Capabilities</span>
        <h2>High-fidelity diagnostics for cloud-scale workloads</h2>
        <p className="features-subtitle">
          GeerGoo combines specialized language models with secure log indexing to map infrastructure health in real time.
        </p>
      </div>

      <div className="feature-grid">
        {features.map(({ icon: Icon, title, description, size }) => (
          <div className={`feature-card ${size}`} key={title}>
            <div className="feature-card-header">
              <div className="feature-icon">
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="feature-arrow" aria-hidden="true">
                <ArrowUpRight size={14} />
              </div>
            </div>
            <div className="feature-card-body">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
