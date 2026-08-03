function Upload() {
  return (
    <div className="upload-page">

      <h1>Upload Log File</h1>

      <p>
        Upload your system log and let GeerGoo analyze it using AI.
      </p>

      <div className="upload-box">

        <h2>📁 Drag & Drop</h2>

        <p>or</p>

        <button>Choose File</button>

        <p className="supported">
          Supported files: .log .txt
        </p>

      </div>

      <button className="upload-btn">
        Upload
      </button>

    </div>
  );
}

export default Upload;