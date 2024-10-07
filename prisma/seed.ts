const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedAssetTypes() {
  const assetTypes = await prisma.assetType.createMany({
    data: [{ type: 'image' }, { type: 'audio' }, { type: 'video' }],
  })
  console.log('AssetTypes seeded:', assetTypes)
}

async function seedTags() {
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Civil War' },
      { name: 'Families' },
      { name: 'Detention' },
      { name: 'Economic Migration' },
      { name: 'Violence' },
      { name: 'Deportation' },
    ],
  })
  console.log('Tags seeded:', tags)
}

async function main() {
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
