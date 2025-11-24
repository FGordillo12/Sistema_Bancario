import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/Modulo_EstadoCuenta.css"

function EstadoCuenta() {
  const navigate = useNavigate()
  const [cuenta, setCuenta] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')


  useEffect(() => {
 
    const cuentaEjemplo = {
      numero: '123-456789-01',
      saldo: 2500000,
      moneda: 'COP',
      fechaApertura: '2024-01-01'
    }
    setCuenta(cuentaEjemplo)

    const movimientosEjemplo = [
      {
        id: 1,
        fecha: '2024-01-15',
        descripcion: 'Consignacion',
        monto: 500000,
        tipo: 'ingreso',
        saldo: 2500000
      },
      {
        id: 2,
        fecha: '2024-01-10',
        descripcion: 'Retiro Cajero',
        monto: 200000,
        tipo: 'egreso',
        saldo: 2000000
      },
      {
        id: 3,
        fecha: '2024-01-05',
        descripcion: 'Pago Transferencia',
        monto: 300000,
        tipo: 'egreso',
        saldo: 2200000
      },
      {
        id: 4,
        fecha: '2024-01-01',
        descripcion: 'Deposito Inicial',
        monto: 2500000,
        tipo: 'ingreso',
        saldo: 2500000
      }
    ]
    setMovimientos(movimientosEjemplo)
  }, [])

  const volverAlDashboard = () => {
    navigate('/dashboardCliente')
  }

  const handleFiltrar = (e) => {
    e.preventDefault()

    console.log('Filtrando por:', fechaInicio, 'a', fechaFin)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO')
  }

  return (
    <div className="estado-cuenta-container">
      <header className="estado-cuenta-header">
        <button className="volver-button" onClick={volverAlDashboard}>
          Volver al Dashboard
        </button>
        <h1 className="estado-cuenta-title">Estado de Cuenta</h1>
      </header>

      {/* Información de la Cuenta */}
      {cuenta && (
        <div className="info-cuenta">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Numero de Cuenta:</span>
              <span className="info-value">{cuenta.numero}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Saldo Disponible:</span>
              <span className="info-saldo">{formatCurrency(cuenta.saldo)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Moneda:</span>
              <span className="info-value">{cuenta.moneda}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fecha de Apertura:</span>
              <span className="info-value">{formatDate(cuenta.fechaApertura)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtros por Fecha */}
      <div className="filtros-container">
        <h3 className="filtros-title">Filtrar por Fecha</h3>
        <form onSubmit={handleFiltrar} className="filtros-form">
          <div className="filtro-group">
            <label className="filtro-label">Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="filtro-input"
            />
          </div>
          <div className="filtro-group">
            <label className="filtro-label">Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="filtro-input"
            />
          </div>
          <button type="submit" className="filtro-button">
            Aplicar Filtro
          </button>
        </form>
      </div>

      {/* Tabla de Movimientos */}
      <div className="movimientos-container">
        <h3 className="movimientos-title">Últimos Movimientos</h3>
        <div className="movimientos-table-container">
          <table className="movimientos-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map(movimiento => (
                <tr key={movimiento.id} className={movimiento.tipo}>
                  <td>{formatDate(movimiento.fecha)}</td>
                  <td>{movimiento.descripcion}</td>
                  <td className={`monto ${movimiento.tipo}`}>
                    {movimiento.tipo === 'ingreso' ? '+' : '-'} {formatCurrency(movimiento.monto)}
                  </td>
                  <td className="saldo">{formatCurrency(movimiento.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen */}
      <div className="resumen-container">
        <h3 className="resumen-title">Resumen del Periodo</h3>
        <div className="resumen-grid">
          <div className="resumen-item ingresos">
            <span className="resumen-label">Total Ingresos:</span>
            <span className="resumen-monto positivo">
              {formatCurrency(3000000)}
            </span>
          </div>
          <div className="resumen-item egresos">
            <span className="resumen-label">Total Egresos:</span>
            <span className="resumen-monto negativo">
              {formatCurrency(500000)}
            </span>
          </div>
          <div className="resumen-item saldo-final">
            <span className="resumen-label">Saldo Final:</span>
            <span className="resumen-monto final">
              {formatCurrency(2500000)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadoCuenta