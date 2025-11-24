import express from 'express';
import Usuarios from '../Models/usuario.js';

const router = express.Router();

// Ruta de prueba GET
router.get('/test', (req, res) => {
  res.json({ message: '✅ Ruta de transacciones funcionando correctamente' });
});

// Recargar saldo
router.post('/recargar-saldo', async (req, res) => {
  try {
    console.log('📥 Body recibido:', req.body);
    
    const { userId, monto, metodoPago, concepto } = req.body;
    
    if (!userId || !monto) {
      return res.status(400).json({ 
        message: 'Datos incompletos. Se requiere userId y monto.' 
      });
    }

    const usuario = await Usuarios.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('👤 Usuario encontrado:', usuario.correo);
    console.log('💰 Saldo actual:', usuario.saldo);
    console.log('💵 Monto a recargar:', monto);

    // Actualizar saldo
    const montoNumero = parseFloat(monto);
    usuario.saldo += montoNumero;
    
    // Registrar transacción
    usuario.transacciones.push({
      tipo: 'recarga',
      monto: montoNumero,
      metodoPago,
      concepto,
      fecha: new Date()
    });

    await usuario.save();

    console.log('✅ Saldo actualizado:', usuario.saldo);

    res.json({ 
      success: true, 
      nuevoSaldo: usuario.saldo,
      message: 'Recarga realizada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error en recargar-saldo:', error);
    res.status(500).json({ 
      message: 'Error en la recarga', 
      error: error.message 
    });
  }
});

// Obtener saldo actual del usuario
router.get('/saldo/:userId', async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ 
      saldo: usuario.saldo,
      correo: usuario.correo 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo saldo', error: error.message });
  }
});




// Retirar saldo
router.post('/retirar-saldo', async (req, res) => {
  try {
    const { userId, monto, concepto } = req.body;
    
    const usuario = await Usuarios.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar saldo suficiente
    if (usuario.saldo < parseFloat(monto)) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    // Actualizar saldo
    usuario.saldo -= parseFloat(monto);
    
    // Registrar transacción
    usuario.transacciones.push({
      tipo: 'retiro',
      monto: parseFloat(monto),
      concepto,
      fecha: new Date()
    });

    await usuario.save();

    res.json({ 
      success: true, 
      nuevoSaldo: usuario.saldo,
      message: 'Retiro realizado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el retiro', error: error.message });
  }
});

// Consignar a otra cuenta
router.post('/consignar', async (req, res) => {
  try {
    const { userId, cuentaDestino, monto, concepto } = req.body;
    
    const usuarioOrigen = await Usuarios.findById(userId);
    const usuarioDestino = await Usuarios.findOne({ numeroCuenta: cuentaDestino });

    if (!usuarioOrigen) {
      return res.status(404).json({ message: 'Usuario origen no encontrado' });
    }

    if (!usuarioDestino) {
      return res.status(404).json({ message: 'Cuenta destino no encontrada' });
    }

    // Verificar saldo suficiente
    if (usuarioOrigen.saldo < parseFloat(monto)) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    // Actualizar saldos
    usuarioOrigen.saldo -= parseFloat(monto);
    usuarioDestino.saldo += parseFloat(monto);
    
    // Registrar transacciones
    usuarioOrigen.transacciones.push({
      tipo: 'consignacion_envio',
      monto: -parseFloat(monto),
      concepto,
      cuentaDestino,
      fecha: new Date()
    });

    usuarioDestino.transacciones.push({
      tipo: 'consignacion_recibo',
      monto: parseFloat(monto),
      concepto: `Consignación de ${usuarioOrigen.correo}`,
      cuentaOrigen: usuarioOrigen.numeroCuenta,
      fecha: new Date()
    });

    await usuarioOrigen.save();
    await usuarioDestino.save();

    res.json({ 
      success: true, 
      nuevoSaldo: usuarioOrigen.saldo,
      message: 'Consignación realizada exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en la consignación', error: error.message });
  }
});

export default router;