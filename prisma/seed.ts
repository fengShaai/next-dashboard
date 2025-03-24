import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10) // Hash the password inside an async function

  const userData = [
    {
      name: 'admin',
      email: 'admin@compuwork.info',
      password: passwordHash,
    },
  ]
  const categories = [
    { name: 'Laptops' },
    { name: 'Desktops' },
    { name: 'Accessories' },
    { name: 'Gaming' },
  ];
  const tags = [
    { name: 'Asus' },
    { name: 'Inteli7' },
    { name: 'Dell Latitude' },
    { name: 'Energy efficient' },
  ];

  for (const tag of tags) {
    await prisma.tag.create({data:tag});
  }
  for (const category of categories) {
    await prisma.category.create({data:category});
  }
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
