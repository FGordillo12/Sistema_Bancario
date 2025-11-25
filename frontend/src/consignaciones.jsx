import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JSEncrypt } from "jsencrypt";
import "../CSS/Modulo_Consignaciones.css";

function Consignaciones({ user, saldoGlobal, actualizarSaldo, cargandoSaldo }) {
  const navigate = useNavigate();
  const [datosConsignacion, setDatosConsignacion] = useState({
    numeroCuenta: "",
    monto: "",
    concepto: "",
  });
  const [cargando, setCargando] = useState(false);
  const [cuentas, setCuentas] = useState([]);

  const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoRHNCc2KSWKwHCjOP+V6
kl95CZy5sarcbfDG4+PmUvbsxP+QXx9j9NXTX2zwPry+l1y175CxpIL6rTYhJdP6
xL6kfPSFyFI3KIy8f6Ug7HgxYmtR3/nmRMRHrTroioHlciu7TlfIRzUHZxENt+2P
Uylc7yuiNxJnri9Z3TaODZHmLdQ8m6sW3q/GZhOzl/v00niqsx20pLa3zJZLeZ94
bchsKT71mEAgjJMxy9J7xI6UZKrnR/663WZD4LySmOPnTWV47twvlJReKywQf7WR
0OnNVLjKvaF3cNLRhZu2uMuOjg9rm/YqXgmXKaGHHqCUQ9WxA2POrEqnmyxGS9mL
iQIDAQAB
-----END PUBLIC KEY-----`;

  useEffect(() => {
    const obtenerCuentas = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/transacciones/ver-cuentas"
        );
        setCuentas(res.data.cuentas || []);
      } catch (error) {
        console.error("Error obteniendo cuentas:", error);
      }
    };
    obtenerCuentas();
  }, []);

  const handleChange = (e) => {
    setDatosConsignacion({
      ...datosConsignacion,
      [e.target.name]: e.target.value,
    });
  };

  const cifrarMonto = (monto) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    const montoCifrado = encrypt.encrypt(monto.toString());
    return montoCifrado; // base64
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datosConsignacion.numeroCuenta)
      return alert("Ingrese la cuenta destino");
    if (!datosConsignacion.monto) return alert("Ingrese un monto");

    const montoNumerico = parseFloat(datosConsignacion.monto);
    if (isNaN(montoNumerico) || montoNumerico < 1000)
      return alert("Monto mínimo $1,000");

    setCargando(true);

    try {
      const montoEncriptado = cifrarMonto(montoNumerico);
      const requestData = {
        userId: user._id,
        cuentaDestino: datosConsignacion.numeroCuenta.trim().toUpperCase(),
        montoEncriptado,
        concepto: datosConsignacion.concepto || "Consignación",
      };

      console.log("=== Datos de Consignación ===");
      console.log("Usuario:", user._id);
      console.log("Cuenta destino:", requestData.cuentaDestino);
      console.log("Monto ingresado:", montoNumerico);
      console.log("Monto a enviar:", montoEncriptado);
      console.log("Concepto:", requestData.concepto);
      console.log("============================");

      const response = await axios.post(
        "http://localhost:3000/api/transacciones/consignar",
        requestData
      );

      console.log("Respuesta del backend:", response.data);

      if (response.data.success) {
        actualizarSaldo(response.data.nuevoSaldo);
        alert(
          `✅ Consignación exitosa a ${
            requestData.cuentaDestino
          }. Nuevo saldo: ${response.data.nuevoSaldo.toLocaleString()}`
        );
        setDatosConsignacion({ numeroCuenta: "", monto: "", concepto: "" });
      }
    } catch (error) {
      console.error("❌ Error en consignación:", error);
      console.error("❌ Datos enviados:", requestData);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const volverAlDashboard = () => navigate("/dashboardCliente");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);

  return (
    <div className="consignaciones-container">
      <header className="consignaciones-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="consignaciones-title">Consignaciones</h1>
        <div className="saldo-actual">
          <span className="saldo-label">Saldo actual:</span>
          <span className="saldo-monto">
            {cargandoSaldo ? "Cargando..." : formatCurrency(saldoGlobal)}
          </span>
        </div>
      </header>

      <div className="consignaciones-form-container">
        <form onSubmit={handleSubmit} className="consignaciones-form">
          <div className="form-group">
            <label className="form-label">Número de Cuenta Destino:</label>
            <input
              type="text"
              name="numeroCuenta"
              list="cuentasDisponibles"
              value={datosConsignacion.numeroCuenta}
              onChange={handleChange}
              placeholder="Ingrese el número de cuenta destino"
              required
              className="form-input"
            />
            <datalist id="cuentasDisponibles">
              {cuentas.map((c) => (
                <option key={c.numeroCuenta} value={c.numeroCuenta}>
                  {c.correo} ({c.numeroCuenta})
                </option>
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">Monto a Consignar:</label>
            <input
              type="number"
              name="monto"
              value={datosConsignacion.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto"
              required
              min="1000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Concepto:</label>
            <textarea
              name="concepto"
              value={datosConsignacion.concepto}
              onChange={handleChange}
              placeholder="Descripción de la consignación"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancelar-button"
              onClick={volverAlDashboard}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="consignaciones-button"
              disabled={cargando}
            >
              {cargando ? "Procesando..." : "Realizar Consignación"}
            </button>
          </div>
        </form>

        <div className="clave-publica">
          <label>Llave Pública RSA:</label>
          <textarea value={PUBLIC_KEY} readOnly rows={6} />
          <button onClick={() => navigator.clipboard.writeText(PUBLIC_KEY)}>
            Copiar llave pública
          </button>
        </div>
      </div>
    </div>
  );
}

export default Consignaciones;
