const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 75%, #cbd5e1 100%)",
    padding: "2rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    height: "85vh",
    minHeight: "600px",
    maxHeight: "900px",
  },
  formWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: "20px",
    boxShadow:
      "0 20px 60px rgba(59, 130, 246, 0.1), 0 8px 25px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: "20px",
  },
  // Mobile styles
  "@media (max-width: 768px)": {
    page: {
      padding: "1rem 0.5rem",
    },
    container: {
      height: "85vh",
      minHeight: "500px",
      maxHeight: "700px",
    },
    formWrapper: {
      borderRadius: "16px",
      boxShadow:
        "0 15px 40px rgba(59, 130, 246, 0.08), 0 5px 20px rgba(0, 0, 0, 0.04)",
    },
    iframe: {
      borderRadius: "16px",
    },
  },
  // Small mobile styles
  "@media (max-width: 480px)": {
    page: {
      padding: "0.5rem 0.25rem",
    },
    container: {
      height: "90vh",
      minHeight: "450px",
    },
    formWrapper: {
      borderRadius: "12px",
    },
    iframe: {
      borderRadius: "12px",
    },
  },
};

export default function UninstallBrowserExtension() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSe8SbjaVZyPeEPq3-ExpwxAOI3Y5Gpjot0byVX7Zs0aQnLjBw/viewform?embedded=true"
            style={styles.iframe}
            title="Eat Word Extension Uninstall Feedback Form"
            loading="lazy"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}
