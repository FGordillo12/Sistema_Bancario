import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/Modulo_Retiros.css"

function Retiros() {
  const navigate = useNavigate()
  const [datosRetiro, setDatosRetiro] = useState({
    numeroCuenta: '',
    monto: '',
    concepto: ''
  })

  const handleChange = (e) => {
    setDatosRetiro({
      ...datosRetiro,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos de retiro:', datosRetiro)
    alert(`Retiro de $${datosRetiro.monto} de la cuenta ${datosRetiro.numeroCuenta} realizado con éxito`)
    
    // Limpiar formulario
    setDatosRetiro({
      numeroCuenta: '',
      monto: '',
      concepto: ''
    })
  }

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  return (
    <div className="retiros-container">
      <header className="retiros-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          ← Volver al Dashboard
        </button>
        <h1 className="retiros-title">Retiros</h1>
      </header>
      
      <div className="retiros-form-container">
        <form onSubmit={handleSubmit} className="retiros-form">
          <div className="form-group">
            <label className="form-label">
              Número de Cuenta:
            </label>
            <input
              type="text"
              name="numeroCuenta"
              value={datosRetiro.numeroCuenta}
              onChange={handleChange}
              placeholder="Ingrese el numero de su cuenta"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monto a Retirar:
            </label>
            <input
              type="number"
              name="monto"
              value={datosRetiro.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto a retirar"
              required
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Concepto:
            </label>
            <textarea
              name="concepto"
              value={datosRetiro.concepto}
              onChange={handleChange}
              placeholder="Descripcion del retiro (opcional)"
              rows="3"
              className="form-textarea"
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancelar-button"
              onClick={volverAlDashboard}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="retiros-button"
            >
              Realizar Retiro
            </button>
          </div>
        </form>
      </div>

      <div className="retiros-info">
        <h3 className="info-title">Informacion Importante:</h3>
        <ul className="info-list">
          <li>Los retiros se procesan inmediatamente</li>
          <li>Verifique que tenga saldo suficiente en su cuenta</li>
          <li>Monto mínimo de retiro: $10.000</li>
        </ul>
      </div>

      <div className="retiros-limites">
        <h3 className="limites-title">Limites Diarios de Retiro:</h3>
        <div className="limites-grid">
          <div className="limite-item">
            <span className="limite-tipo">Maximo por dia</span>
            <span className="limite-monto">$5'000.000</span>
          </div>
          <div className="limite-item">
            <span className="limite-tipo">Transacciones maximo.</span>
            <span className="limite-monto">3 por dia</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Retiros