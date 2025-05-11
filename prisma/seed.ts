import { PrismaClient } from '@prisma/client'
import { CreateUserDTO } from '@/modules/user/application/dtos/CreateUserDTO'

const prisma = new PrismaClient()

async function seedUser(createUserDTO: CreateUserDTO) {
  const count = await prisma.user.count()

  if (count > 0) {
    console.log('Users already seeded.')
    return
  }

  const user = await prisma.user.create({
    data: createUserDTO,
  })

  console.log('User seeded:', user)
}

async function seedAssetTypes() {
  const count = await prisma.assetType.count()

  if (count > 0) {
    console.log('AssetTypes already seeded.')
    return
  }

  const assetTypes = await prisma.assetType.createMany({
    data: [{ type: 'image' }, { type: 'audio' }, { type: 'video' }],
  })

  console.log('AssetTypes seeded:', assetTypes)
}

async function seedTags() {
  const count = await prisma.tag.count()

  if (count > 0) {
    console.log('Tags already seeded.')
    return
  }
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Civil War' },
      { name: 'Families' },
      { name: 'Detention' },
      { name: 'Economic Migration' },
      { name: 'Violence' },
      { name: 'Deportation' },
      { name: 'Asylum' },
      { name: 'Resilience' },
      { name: 'Privilege' },
    ],
  })
  console.log('Tags seeded:', tags)
}

async function main() {
  const adminName = process.env.ADMIN_NAME
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminName || !adminEmail || !adminPassword) {
    console.warn(
      'Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD environment variables.'
    )
    console.warn(
      'Skipping seeding. Please set these variables in your .env file.'
    )

    return
  }

  const adminUser = {
    name: adminName,
    email: adminEmail,
    password: adminPassword,
  } as CreateUserDTO

  await seedUser(adminUser)
  await seedAssetTypes()
  await seedTags()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
