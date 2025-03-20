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
