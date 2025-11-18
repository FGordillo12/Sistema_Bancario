import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import NodeRSA from 'node-rsa'
import nodemailer from 'nodemailer'

const app = express()
app.use(cors())
app.use(express.json())

// Datos en memoria
let users = []
let cuentas = []
let transacciones = []
let codigosVerificacion = {}

// Claves RSA
const key = new NodeRSA({ b: 512 })
const publicKey = key.exportKey('public')
const privateKey = key.exportKey('private')

// Configuración de email - CORREGIDO: createTransport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test@test.com',
    pass: 'test123'
  }
})

// Middleware para decryptar
const decryptPassword = (req, res, next) => {
  if (req.body.password) {
    try {
      const decrypted = key.decrypt(req.body.password, 'utf8')
      req.body.password = decrypted
    } catch (error) {
      return res.status(400).json({ message: 'Error decryptando contraseña' })
    }
  }
  next()
}

// Routes
app.post('/api/login', decryptPassword, (req, res) => {
  const { email, password } = req.body
  
  console.log('Login attempt:', email)
  
  let user = users.find(u => u.email === email)
  
  if (!user) {
    user = { 
      id: crypto.randomBytes(16).toString('hex'), 
      email, 
      password 
    }
    users.push(user)
  } else if (user.password !== password) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  // Generar código (sin enviar email por ahora)
  const codigo = "123456" // Para pruebas
  codigosVerificacion[email] = codigo

  console.log(`🔐 Código de verificación para ${email}: ${codigo}`)

  res.json({ 
    codigoEnviado: true,
    message: 'Código: 123456 (ver consola del servidor)'
  })
})

app.post('/api/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body
  
  console.log('Verificación código:', email, codigo)
  
  if (codigosVerificacion[email] === codigo) {
    delete codigosVerificacion[email]
    const user = users.find(u => u.email === email)
    res.json({ 
      user: { id: user.id, email: user.email },
      message: 'Login exitoso'
    })
  } else {
    res.status(401).json({ message: 'Código inválido' })
  }
})

app.post('/api/cuentas', (req, res) => {
  const { userId, tipo, saldoInicial } = req.body
  const cuenta = {
    id: crypto.randomBytes(8).toString('hex'),
    userId,
    tipo,
    saldo: saldoInicial,
    fechaCreacion: new Date()
  }
  cuentas.push(cuenta)
  res.json(cuenta)
})

app.get('/api/cuentas/:userId', (req, res) => {
  const userCuentas = cuentas.filter(c => c.userId === req.params.userId)
  res.json(userCuentas)
})

app.post('/api/transacciones', (req, res) => {
  const { userId, cuentaId, tipo, monto } = req.body
  
  const cuenta = cuentas.find(c => c.id === cuentaId && c.userId === userId)
  if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' })

  if (tipo === 'retiro' && cuenta.saldo < monto) {
    return res.status(400).json({ message: 'Saldo insuficiente' })
  }

  cuenta.saldo = tipo === 'deposito' ? cuenta.saldo + monto : cuenta.saldo - monto

  const transaccion = {
    id: crypto.randomBytes(8).toString('hex'),
    cuentaId,
    tipo,
    monto,
    fecha: new Date()
  }
  transacciones.push(transaccion)

  res.json(transaccion)
})

app.get('/api/test', (req, res) => {
  res.json({ message: '¡Servidor funcionando correctamente!' })
})

app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001')
  console.log('🔐 Sistema listo - Usa código: 123456 para login')
})