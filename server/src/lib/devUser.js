import prisma from '../lib/prisma.js'

const DEV_USER_EMAIL = 'dev@pricedrop.local'

export async function getDevUser() {
  let user = await prisma.user.findUnique({
    where: { email: DEV_USER_EMAIL },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEV_USER_EMAIL,
        // Phase 4 replaces this with bcrypt-hashed real passwords
        password: 'dev-placeholder',
      },
    })
  }

  return user
}
