import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.usuario.findMany();
  console.log('Usuarios encontrados en la base de datos:', users.map(u => ({ id: u.id, email: u.email, rol: u.rol })));

  if (users.length === 0) {
    console.log('\n❌ No hay usuarios registrados en la base de datos todavía.');
    console.log('👉 Por favor regístrate primero en la página web (http://localhost:5173/register) y luego vuelve a ejecutar este script.');
    return;
  }

  const arg = process.argv[2]?.trim();

  if (arg && arg !== '--all') {
    const targetEmail = arg.toLowerCase();
    const user = await prisma.usuario.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      console.log(`\n❌ No se encontró ningún usuario con el correo: "${targetEmail}".`);
      return;
    }

    await prisma.usuario.update({
      where: { email: targetEmail },
      data: { rol: 'ADMIN' },
    });

    console.log(`\n✅ ¡Éxito! El usuario "${user.nombre}" (${targetEmail}) ha sido promovido al rol 'ADMIN'.`);
    console.log('👉 Cierra tu sesión actual en la web y vuelve a ingresar para activar los permisos de administrador.');
    return;
  }

  if (arg === '--all') {
    const result = await prisma.usuario.updateMany({
      data: { rol: 'ADMIN' },
    });
    console.log(`\n✅ ¡Éxito! Se han promovido ${result.count} usuario(s) al rol 'ADMIN'.`);
    console.log('👉 Cierra sesión y vuelve a ingresar para cargar el rol de administrador.');
    return;
  }

  console.log('\n💡 Instrucciones de uso:');
  console.log('   Para promover a un usuario específico a ADMIN:');
  console.log('   npm run promote-admin -- correo@ejemplo.com');
  console.log('\n   Para promover a todos los usuarios de prueba:');
  console.log('   npm run promote-admin -- --all');
}

main()
  .catch((e) => {
    console.error('Error al promover usuarios:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
