import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la siembra de la base de datos (seeding)...');

  // 1. Limpiar base de datos en orden para evitar errores de claves foráneas
  console.log('🧹 Limpiando datos existentes...');
  await prisma.stockTalla.deleteMany();
  await prisma.detalleOrden.deleteMany();
  await prisma.orden.deleteMany();
  await prisma.zapato.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Crear administrador predeterminado
  console.log('👤 Creando usuario administrador inicial...');
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('AdminPassword123', saltRounds);
  const clientPasswordHash = await bcrypt.hash('ClientPassword123', saltRounds);

  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador AbbySport',
      email: 'admin@abbysport.com',
      password: adminPasswordHash,
      rol: 'ADMIN',
    },
  });

  const cliente = await prisma.usuario.create({
    data: {
      nombre: 'Cliente de Prueba',
      email: 'cliente@test.com',
      password: clientPasswordHash,
      rol: 'CLIENTE',
    },
  });

  console.log(`✅ Usuarios creados: Admin (${admin.email}), Cliente (${cliente.email})`);

  // 3. Crear categorías
  console.log('📁 Creando categorías...');
  const catRunning = await prisma.categoria.create({ data: { nombre: 'Running' } });
  const catCasual = await prisma.categoria.create({ data: { nombre: 'Casual' } });
  const catUrban = await prisma.categoria.create({ data: { nombre: 'Urban' } });
  const catDeportivo = await prisma.categoria.create({ data: { nombre: 'Deportivo' } });

  console.log('✅ Categorías creadas exitosamente.');

  // 4. Crear zapatos de prueba con stock por talla
  console.log('👟 Creando calzado de prueba con stock por talla...');

  const calzados = [
    {
      nombre: 'Abby Run Stealth',
      descripcion: 'Calzado de running ultraligero con amortiguación premium de espuma reactiva para maratones y asfalto.',
      precio: 349900,
      imagenUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      categoriaId: catRunning.id,
      tallas: ['38', '39', '40', '41', '42'],
      stockTallas: [
        { talla: '38', stock: 8 },
        { talla: '39', stock: 12 },
        { talla: '40', stock: 5 },
        { talla: '41', stock: 10 },
        { talla: '42', stock: 2 },
      ]
    },
    {
      nombre: 'Retro White Air',
      descripcion: 'Tenis clásicos de cuero blanco con diseño retro urbano y suela de alta resistencia para uso diario.',
      precio: 289900,
      imagenUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
      categoriaId: catCasual.id,
      tallas: ['39', '40', '41', '42'],
      stockTallas: [
        { talla: '39', stock: 15 },
        { talla: '40', stock: 8 },
        { talla: '41', stock: 4 },
        { talla: '42', stock: 12 },
      ]
    },
    {
      nombre: 'Urban Classic Leather',
      descripcion: 'Zapatos de cuero café auténtico de acabado premium, ideales para un estilo casual-formal muy cómodo.',
      precio: 399900,
      imagenUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
      categoriaId: catUrban.id,
      tallas: ['38', '39', '40', '41'],
      stockTallas: [
        { talla: '38', stock: 5 },
        { talla: '39', stock: 0 },
        { talla: '40', stock: 7 },
        { talla: '41', stock: 10 },
      ]
    },
    {
      nombre: 'Chrono Sport Neon',
      descripcion: 'Calzado deportivo diseñado para entrenamientos de fuerza, con soporte lateral mejorado y suela antideslizante.',
      precio: 259900,
      imagenUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
      categoriaId: catDeportivo.id,
      tallas: ['38', '39', '40', '41', '42'],
      stockTallas: [
        { talla: '38', stock: 10 },
        { talla: '39', stock: 10 },
        { talla: '40', stock: 10 },
        { talla: '41', stock: 0 },
        { talla: '42', stock: 5 },
      ]
    }
  ];

  for (const item of calzados) {
    await prisma.zapato.create({
      data: {
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        imagenUrl: item.imagenUrl,
        categoriaId: item.categoriaId,
        tallas: item.tallas,
        stockTallas: {
          create: item.stockTallas
        }
      }
    });
  }

  console.log('🌱 ¡Siembra de base de datos finalizada con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra de la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
