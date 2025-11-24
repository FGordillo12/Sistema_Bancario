import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../CSS/Modulo_Consignaciones.css";

function Consignaciones({ user }) {
  const navigate = useNavigate()
  const [datosConsignacion, setDatosConsignacion] = useState({
    numeroCuenta: '',
    monto: '',
    concepto: ''
  })
  const [cargando, setCargando] = useState(false)
  const [saldoActual, setSaldoActual] = useState(0)
  const [cargandoSaldo, setCargandoSaldo] = useState(true)

  // Obtener saldo actual
  useEffect(() => {
    const obtenerSaldo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/transacciones/saldo/${user._id}`)
        setSaldoActual(response.data.saldo)
      } catch (error) {
        console.error('Error obteniendo saldo:', error)
      } finally {
        setCargandoSaldo(false)
      }
    }

    if (user?._id) {
      obtenerSaldo()
    }
  }, [user?._id])

  const handleChange = (e) => {
    setDatosConsignacion({
      ...datosConsignacion,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!datosConsignacion.numeroCuenta) {
      alert('❌ Error: Ingrese el número de cuenta destino');
      return;
    }

    if (!datosConsignacion.monto) {
      alert('❌ Error: Ingrese un monto');
      return;
    }

    const montoNumerico = parseFloat(datosConsignacion.monto);
    if (isNaN(montoNumerico) || montoNumerico < 1000) {
      alert('❌ Error: Monto mínimo $1,000');
      return;
    }

    setCargando(true)
    
    try {
      const requestData = {
        userId: user._id.toString(),
        cuentaDestino: datosConsignacion.numeroCuenta,
        monto: montoNumerico,
        concepto: datosConsignacion.concepto || 'Consignación'
      };

      const response = await axios.post(
        'http://localhost:3000/api/transacciones/consignar', 
        requestData
      );

      if (response.data.success) {
        setSaldoActual(response.data.nuevoSaldo) // Actualizar saldo en tiempo real
        alert(`✅ Consignación exitosa a la cuenta ${datosConsignacion.numeroCuenta}! Nuevo saldo: $${response.data.nuevoSaldo.toLocaleString()}`)
        setDatosConsignacion({ numeroCuenta: '', monto: '', concepto: '' })
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setCargando(false)
    }
  }

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  return (
    <div className="consignaciones-container">
      <header className="consignaciones-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          ← Volver al Dashboard
        </button>
        <h1 className="consignaciones-title">Consignaciones</h1>
        
        {/* Saldo actual */}
        <div className="saldo-actual">
          <span className="saldo-label">Saldo actual:</span>
          <span className="saldo-monto">
            {cargandoSaldo ? 'Cargando...' : formatCurrency(saldoActual)}
          </span>
        </div>
      </header>
      
      <div className="consignaciones-form-container">
        <form onSubmit={handleSubmit} className="consignaciones-form">
          <div className="form-group">
            <label className="form-label">
              Número de Cuenta Destino:
            </label>
            <input
              type="text"
              name="numeroCuenta"
              value={datosConsignacion.numeroCuenta}
              onChange={handleChange}
              placeholder="Ingrese el número de cuenta destino"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monto a Consignar:
            </label>
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
            <label className="form-label">
              Concepto:
            </label>
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
              {cargando ? 'Procesando...' : 'Realizar Consignación'}
            </button>
          </div>
        </form>
      </div>

      <div className="consignaciones-info">
        <h3 className="info-title">Información Importante:</h3>
        <ul className="info-list">
          <li>Las consignaciones se procesan inmediatamente</li>
          <li>Verifique bien el número de cuenta destino</li>
          <li>Monto mínimo de consignación: $1.000</li>
          <li>Monto máximo por transacción: $10'000.000</li>
          <li>Horario de procesamiento: 24/7</li>
          <li>Se requiere saldo suficiente en su cuenta</li>
        </ul>
      </div>
    </div>
  )
}

export default Consignaciones