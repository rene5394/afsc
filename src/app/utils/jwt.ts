import { jwtVerify } from 'jose'

export async function verifyJWT(token: string, secret: string) {
  const encodedSecret = new TextEncoder().encode(secret)

  try {
    const { payload } = await jwtVerify(token, encodedSecret)

    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}
