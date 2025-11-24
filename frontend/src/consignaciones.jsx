import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/Modulo_Consignaciones.css";

function Consignaciones() {
  const navigate = useNavigate()
  const [datosConsignacion, setDatosConsignacion] = useState({
    numeroCuenta: '',
    monto: '',
    concepto: ''
  })

  const handleChange = (e) => {
    setDatosConsignacion({
      ...datosConsignacion,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos de consignación:', datosConsignacion)
    alert(`Consignación de $${datosConsignacion.monto} a la cuenta ${datosConsignacion.numeroCuenta} realizada con éxito`)
    
    // Limpiar formulario
    setDatosConsignacion({
      numeroCuenta: '',
      monto: '',
      concepto: ''
    })
  }

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  return (
    <div className="consignaciones-container">
      <header className="consignaciones-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="consignaciones-title">Consignaciones</h1>
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
              placeholder="Ingrese el numero de cuenta"
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
              value={datosConsignacion.concepto}
              onChange={handleChange}
              placeholder="Descripcion de la consignacion"
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
              className="consignaciones-button"
            >
              Realizar Consignacion
            </button>
          </div>
        </form>
      </div>

      <div className="consignaciones-info">
        <h3 className="info-title">Informacion Importante:</h3>
        <ul className="info-list">
          <li>Las consignaciones se procesan inmediatamente</li>
          <li>Verifique bien el numero de cuenta destino</li>
          <li>Monto mínimo de consignacion: $1.000</li>
          <li>Horario de procesamiento: 24/7</li>
        </ul>
      </div>
    </div>
  )
}

export default Consignaciones