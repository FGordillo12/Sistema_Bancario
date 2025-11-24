import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/Modulo_RecargarSaldo.css"

function RecargarSaldo() {
  const navigate = useNavigate()
  const [datosRecarga, setDatosRecarga] = useState({
    numeroCuenta: '',
    monto: '',
    metodoPago: 'transferencia',
    concepto: ''
  })

  const handleChange = (e) => {
    setDatosRecarga({
      ...datosRecarga,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos de recarga:', datosRecarga)
    alert(`Recarga de $${datosRecarga.monto} a la cuenta ${datosRecarga.numeroCuenta} realizada con éxito`)
    
    // Limpiar formulario
    setDatosRecarga({
      numeroCuenta: '',
      monto: '',
      metodoPago: 'transferencia',
      concepto: ''
    })
  }

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  return (
    <div className="recargar-saldo-container">
      <header className="recargar-saldo-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="recargar-saldo-title">Recargar Saldo</h1>
      </header>
      
      <div className="recargar-saldo-form-container">
        <form onSubmit={handleSubmit} className="recargar-saldo-form">
          <div className="form-group">
            <label className="form-label">
              Numero de Cuenta:
            </label>
            <input
              type="text"
              name="numeroCuenta"
              value={datosRecarga.numeroCuenta}
              onChange={handleChange}
              placeholder="Ingrese el número de su cuenta"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monto a Recargar:
            </label>
            <input
              type="number"
              name="monto"
              value={datosRecarga.monto}
              onChange={handleChange}
              placeholder="Ingrese el monto a recargar"
              required
              min="1"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Metodo de Pago:
            </label>
            <select
              name="metodoPago"
              value={datosRecarga.metodoPago}
              onChange={handleChange}
              className="form-select"
            >
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="tarjeta">Tarjeta Debito/Credito</option>
              <option value="efectivo">Pago en Efectivo</option>
              <option value="billetera">Nequi</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Concepto:
            </label>
            <textarea
              name="concepto"
              value={datosRecarga.concepto}
              onChange={handleChange}
              placeholder="Descripcion de la recarga (opcional)"
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
              className="recargar-button"
            >
              Realizar Recarga
            </button>
          </div>
        </form>
      </div>

      <div className="recargar-saldo-info">
        <h3 className="info-title">Informacion Importante:</h3>
        <ul className="info-list">
          <li>Las recargas se procesan en un maximo de 24 horas</li>
          <li>Verifique bien el numero de cuenta destino</li>
          <li>Monto minimo de recarga: $10.000</li>
          <li>Monto maximo por recarga: $5'000.000</li>
          <li>Comisiones pueden aplicar según el metodo de pago</li>
        </ul>
      </div>

      <div className="metodos-pago-info">
        <h3 className="metodos-title">Métodos de Pago Disponibles:</h3>
        <div className="metodos-grid">
          <div className="metodo-item">
            <div className="metodo-icon">🏦</div>
            <span className="metodo-nombre">Transferencia</span>
            <span className="metodo-comision">Sin comisión</span>
          </div>
          <div className="metodo-item">
            <div className="metodo-icon">💳</div>
            <span className="metodo-nombre">Tarjeta</span>
            <span className="metodo-comision">1.5% comisión</span>
          </div>
          <div className="metodo-item">
            <div className="metodo-icon">💰</div>
            <span className="metodo-nombre">Efectivo</span>
            <span className="metodo-comision">$2.000 comisión</span>
          </div>
          <div className="metodo-item">
            <div className="metodo-icon">📱</div>
            <span className="metodo-nombre">Nequi</span>
            <span className="metodo-comision">1% comisión</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecargarSaldo