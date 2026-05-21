export default function Button({ label, onClick, variant = "primary" }) {
  const styles = {
    primary: {
      background: "var(--accent)",
      color: "#fff",
      border: "none",
    },
    ghost: {
      background: "transparent",
      color: "var(--white-60)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "transparent",
      color: "#f87171",
      border: "1px solid #f87171",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: "10px 22px",
        borderRadius: "var(--r-md)",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {label}
    </button>
  );
}
