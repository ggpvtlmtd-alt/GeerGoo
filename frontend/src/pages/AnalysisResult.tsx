function AnalysisResult() {
  return (
    <div className="analysis-page">

      <h1>AI Analysis Result</h1>

      <div className="analysis-card">

        <h3>Language</h3>
        <p>Python</p>

        <h3>Error Type</h3>
        <p>IndexError</p>

        <h3>Severity</h3>
        <p>High</p>

        <h3>AI Summary</h3>
        <p>
          The application attempted to access a list index
          that does not exist.
        </p>

        <h3>Recommended Fix</h3>
        <p>
          Check list length before accessing indexes.
        </p>

      </div>

    </div>
  );
}

export default AnalysisResult;