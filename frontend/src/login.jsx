import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [Correo, setCorreo] = useState("");
  const [Contraseña, setContraseña] = useState("");
  const [Codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [userTemp, setUserTemp] = useState(null); // Para guardar el user temporalmente

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requires2FA) {
      // Login email + password
      try {
        const respuesta = await fetch("http://localhost:3000/apis/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: Correo, password: Contraseña }),
        });

        const data = await respuesta.json();

        console.log("🔍 Respuesta del login:", data); // Debug

        if (respuesta.ok && data.requires2FA) {
          setRequires2FA(true);
          setMensaje("Se envió un código a tu correo");
          // ✅ Guardar el user temporalmente para usarlo después
          if (data.user) {
            setUserTemp(data.user);
            console.log("🔍 User temporal guardado:", data.user);
          }
        } else if (respuesta.ok && data.usuario) {
          onLogin(data.usuario);
          if (data.rol === "admin") {
            navigate("/dashboard");
          } else if (data.rol === "cliente") {
            navigate("/dashboardCliente");
          }
        } else {
          setMensaje(data.message || "Error en login");
        }
      } catch (error) {
        console.error("Error en login:", error);
        setMensaje("Error de servidor");
      }
    } else {
      // Verificar código 2FA
      try {
        const respuesta = await fetch("http://localhost:3000/api/verify-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: Correo, token: Codigo.trim() }),
        });

        const data = await respuesta.json();

        console.log("🔍 Respuesta del verify-2fa:", data); // Debug

        if (!respuesta.ok) {
          console.error("Error de backend:", data);
          setMensaje(data.message || "Error en verificación 2FA");
          return;
        }

        setMensaje("Login completo!");
        
        // ✅ CORREGIDO: Usar el user del backend O el temporal
        const usuarioCompleto = data.user || userTemp || { 
          correo: Correo, 
          _id: userTemp?._id 
        };
        
        console.log("🔍 Usuario que se guardará:", usuarioCompleto);
        
        onLogin(usuarioCompleto);
        
        if (data.rol === "admin") {
          navigate("/dashboard");
        } else if (data.rol === "cliente") {
          navigate("/dashboardCliente");
        }
      } catch (error) {
        console.error("Error en fetch verify-2fa:", error);
        setMensaje("Error de conexión al servidor");
      }
    }
  };

  return (
    <main className="contenedor-principal">
      <div className="caja-fondo">
        <h1>Iniciar Sesión</h1>
        <div className="formulario">
          <form onSubmit={handleSubmit}>
            {!requires2FA && (
              <>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  required
                  value={Correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  required
                  value={Contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </>
            )}

            {requires2FA && (
              <input
                type="text"
                placeholder="Código 2FA"
                required
                value={Codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            )}

            <button type="submit">
              {!requires2FA ? "Iniciar Sesión" : "Verificar Código"}
            </button>
          </form>
          {mensaje && <p>{mensaje}</p>}
          
          {/* Debug info */}
          {userTemp && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              marginTop: '10px',
              borderRadius: '5px',
              fontSize: '12px'
            }}>
              <strong>Debug:</strong> UserTemp ID: {userTemp._id}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;