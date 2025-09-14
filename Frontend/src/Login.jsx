import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de autenticación
    alert(`Usuario: ${username}\nContraseña: ${password}`);
  };

  return (
    <div style={styles.background}>
      <div style={styles.title}>UlStorage</div>
      <div style={styles.container}>
        <h2 style={styles.header}>Ingrese sus credenciales</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
          <button type="submit" style={styles.button}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0f7fa 0%, #fff 100%)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#ff9800",
    marginBottom: "1.5rem",
    letterSpacing: "2px",
    textShadow: "0 2px 8px #b2ebf2",
  },
  container: {
    width: "25vw",
    minWidth: 320,
    maxWidth: 400,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 8px 32px 0 rgba(44, 62, 80, 0.15)",
    padding: "2.5rem 2rem 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    color: "#0288d1",
    fontWeight: 600,
    marginBottom: 24,
    fontSize: "1.2rem",
    letterSpacing: "1px",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  input: {
    width: "100%",
    padding: "0.8rem 1rem",
    marginBottom: 16,
    border: "1px solid #b3e5fc",
    borderRadius: 8,
    fontSize: "1rem",
    outline: "none",
    background: "#f9fafd",
    color: "#333",
    transition: "border 0.2s",
  },
  button: {
    width: "100%",
    padding: "0.8rem 1rem",
    background: "linear-gradient(90deg, #0288d1 60%, #ff9800 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 2px 8px 0 rgba(2,136,209,0.10)",
    transition: "background 0.2s",
  },
};

export default Login;
