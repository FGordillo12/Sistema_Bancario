import express from 'express';
import Usuarios from '../Models/usuario.js';

const router = express.Router();

console.log('🔄 Router de transacciones cargado correctamente');

// ==================== RUTAS DE DEBUG ====================
router.get('/debug-routes', (req, res) => {
  const routes = [];
  router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(method => method.toUpperCase());
      routes.push({
        path: layer.route.path,
        methods: methods
      });
    }
  });
  
  console.log('📋 Rutas registradas:');
  routes.forEach(route => {
    console.log(`   ${route.methods.join(', ')} ${route.path}`);
  });
  
  res.json({ 
    message: 'Rutas disponibles',
    total: routes.length,
    routes: routes 
  });
});

// ==================== RUTAS DE CUENTAS ====================
router.get('/ver-cuentas', async (req, res) => {
  try {
    const todasCuentas = await Usuarios.find({ numeroCuenta: { $exists: true } }, 'correo numeroCuenta saldo');
    
    console.log('📋 Cuentas existentes:');
    todasCuentas.forEach(cuenta => {
      console.log(`   - ${cuenta.numeroCuenta} (${cuenta.correo}) - Saldo: $${cuenta.saldo}`);
    });
    
    res.json({
      total: todasCuentas.length,
      cuentas: todasCuentas.map(c => ({ 
        correo: c.correo, 
        numeroCuenta: c.numeroCuenta, 
        saldo: c.saldo 
      }))
    });
  } catch (error) {
    console.error('❌ Error obteniendo cuentas:', error);
    res.status(500).json({ message: 'Error obteniendo cuentas', error: error.message });
  }
});

// Ruta GET temporal para asignar cuentas
router.get('/asignar-cuentas-get', async (req, res) => {
  try {
    console.log('🔄 Asignando números de cuenta a usuarios...');
    
    const usuariosSinCuenta = await Usuarios.find({ 
      numeroCuenta: { $exists: false } 
    });
    
    console.log(`👥 Usuarios sin cuenta: ${usuariosSinCuenta.length}`);
    
    for (const usuario of usuariosSinCuenta) {
      const numeroCuenta = generarNumeroCuenta();
      usuario.numeroCuenta = numeroCuenta;
      await usuario.save();
      console.log(`✅ Asignada cuenta ${numeroCuenta} a ${usuario.correo}`);
    }
    
    const todasCuentas = await Usuarios.find({ numeroCuenta: { $exists: true } }, 'correo numeroCuenta saldo');
    console.log('📋 Todas las cuentas después de asignar:');
    todasCuentas.forEach(cuenta => {
      console.log(`   - ${cuenta.numeroCuenta} (${cuenta.correo}) - Saldo: $${cuenta.saldo}`);
    });
    
    res.json({
      success: true,
      message: `Números de cuenta asignados a ${usuariosSinCuenta.length} usuarios`,
      cuentas: todasCuentas.map(c => ({ correo: c.correo, cuenta: c.numeroCuenta, saldo: c.saldo }))
    });
    
  } catch (error) {
    console.error('❌ Error asignando cuentas:', error);
    res.status(500).json({ message: 'Error asignando cuentas', error: error.message });
  }
});

function generarNumeroCuenta() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 8; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

// ==================== RUTAS PRINCIPALES ====================
router.get('/test', (req, res) => {
  res.json({ message: '✅ Ruta de transacciones funcionando correctamente' });
});

// Recargar saldo
router.post('/recargar-saldo', async (req, res) => {
  try {
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

    const montoNumero = parseFloat(monto);
    usuario.saldo += montoNumero;
    
    usuario.transacciones.push({
      tipo: 'recarga',
      monto: montoNumero,
      metodoPago,
      concepto,
      fecha: new Date()
    });

    await usuario.save();

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

// Obtener saldo actual del usuario (ACTUALIZADA para incluir numeroCuenta)
router.get('/saldo/:userId', async (req, res) => {
  try {
    const usuario = await Usuarios.findById(req.params.userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ 
      saldo: usuario.saldo,
      correo: usuario.correo,
      numeroCuenta: usuario.numeroCuenta // ← INCLUIR NUMERO DE CUENTA
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo saldo', error: error.message });
  }
});

// Obtener transacciones del usuario
router.get('/transacciones/:userId', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const usuario = await Usuarios.findById(req.params.userId);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let transacciones = usuario.transacciones;

    if (fechaInicio || fechaFin) {
      transacciones = transacciones.filter(transaccion => {
        const fechaTransaccion = new Date(transaccion.fecha);
        let cumpleFiltro = true;

        if (fechaInicio) {
          const inicio = new Date(fechaInicio);
          cumpleFiltro = cumpleFiltro && fechaTransaccion >= inicio;
        }

        if (fechaFin) {
          const fin = new Date(fechaFin);
          fin.setHours(23, 59, 59, 999);
          cumpleFiltro = cumpleFiltro && fechaTransaccion <= fin;
        }

        return cumpleFiltro;
      });
    }

    res.json({ 
      transacciones,
      total: transacciones.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error obteniendo transacciones', 
      error: error.message 
    });
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

    if (usuario.saldo < parseFloat(monto)) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    usuario.saldo -= parseFloat(monto);
    
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

// Consignar a otra cuenta - VERSIÓN SIMPLIFICADA
router.post('/consignar', async (req, res) => {
  try {
    console.log('🎯 RUTA /CONSIGNAR EJECUTADA');
    console.log('📥 Datos recibidos:', req.body);
    
    const { userId, cuentaDestino, monto, concepto } = req.body;
    
    const cuentaDestinoLimpia = cuentaDestino.trim().toUpperCase();
    console.log('🔍 Buscando cuenta destino:', cuentaDestinoLimpia);

    const usuarioOrigen = await Usuarios.findById(userId);
    const usuarioDestino = await Usuarios.findOne({ 
      numeroCuenta: { $regex: new RegExp(`^${cuentaDestinoLimpia}$`, 'i') }
    });

    if (!usuarioOrigen) {
      return res.status(404).json({ message: 'Usuario origen no encontrado' });
    }

    if (!usuarioDestino) {
      console.log('❌ Cuenta destino no encontrada');
      const todasCuentas = await Usuarios.find({ numeroCuenta: { $exists: true } }, 'numeroCuenta correo');
      console.log('📋 Cuentas disponibles:');
      todasCuentas.forEach(cuenta => {
        console.log(`   - ${cuenta.numeroCuenta} (${cuenta.correo})`);
      });
      return res.status(404).json({ message: 'Cuenta destino no encontrada' });
    }

    const montoNumerico = parseFloat(monto);
    if (usuarioOrigen.saldo < montoNumerico) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    if (montoNumerico < 1000) {
      return res.status(400).json({ message: 'Monto mínimo de consignación es $1,000' });
    }

    usuarioOrigen.saldo -= montoNumerico;
    usuarioDestino.saldo += montoNumerico;
    
    usuarioOrigen.transacciones.push({
      tipo: 'consignacion_envio',
      monto: -montoNumerico,
      concepto: concepto || 'Consignación',
      cuentaDestino: usuarioDestino.numeroCuenta,
      fecha: new Date()
    });

    usuarioDestino.transacciones.push({
      tipo: 'consignacion_recibo',
      monto: montoNumerico,
      concepto: `Consignación de ${usuarioOrigen.correo}`,
      cuentaOrigen: usuarioOrigen.numeroCuenta,
      fecha: new Date()
    });

    await usuarioOrigen.save();
    await usuarioDestino.save();

    console.log('✅ Consignación exitosa');
    console.log(`   Origen: ${usuarioOrigen.correo} - Nuevo saldo: $${usuarioOrigen.saldo}`);
    console.log(`   Destino: ${usuarioDestino.correo} - Nuevo saldo: $${usuarioDestino.saldo}`);

    res.json({ 
      success: true, 
      nuevoSaldo: usuarioOrigen.saldo,
      message: 'Consignación realizada exitosamente' 
    });
  } catch (error) {
    console.error('❌ Error en consignación:', error);
    res.status(500).json({ message: 'Error en la consignación', error: error.message });
  }
});

export default router;