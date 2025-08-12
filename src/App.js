import React, { useState } from "react";
import "./App.css";
import ServicosBoard from "./components/ServicosBoard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("home");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin@123") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Usuário ou senha inválidos!");
    }
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownClick = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-left">
              <div className="dropdown">
                <button
                  className="dropdown-button"
                  onClick={() => handleDropdownClick("cadastros")}
                >
                  Cadastros
                </button>
                <div
                  className={`dropdown-content ${
                    activeDropdown === "cadastros" ? "show" : ""
                  }`}
                >
                  <button onClick={() => console.log("Protéticos")}>
                    Protéticos
                  </button>
                  <button onClick={() => console.log("Funcionários")}>
                    Funcionários
                  </button>
                </div>
              </div>
              <button
                className="dropdown-button"
                onClick={() => setCurrentView("servicos")}
              >
                Serviços
              </button>
            </div>
            <button
              className="logout-button"
              onClick={() => setIsLoggedIn(false)}
            >
              Sair
            </button>
          </div>
        </nav>
        <main className="main-content">
          {currentView === "home" ? (
            <h1>Bem-vindo ao Sistema</h1>
          ) : currentView === "servicos" ? (
            <ServicosBoard />
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <label className="login-label">Usuário:</label>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <label className="login-label">Senha:</label>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
