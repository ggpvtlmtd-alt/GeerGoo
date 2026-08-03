function History() {
  return (
    <div className="history-page">
      <h1>Analysis History</h1>

      <p>
        View all your previously analyzed log files.
      </p>

      <div className="history-table">

        <div className="history-row header">
          <span>Filename</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        <div className="history-row">
          <span>server.log</span>
          <span>Critical</span>
          <span>Today</span>
        </div>

        <div className="history-row">
          <span>backend.log</span>
          <span>Warning</span>
          <span>Yesterday</span>
        </div>

        <div className="history-row">
          <span>auth.log</span>
          <span>Resolved</span>
          <span>2 days ago</span>
        </div>

      </div>
    </div>
  );
}

export default History;