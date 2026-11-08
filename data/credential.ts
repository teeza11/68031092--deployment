// data/credential.ts

type User = {
  email: string
  password: string
  name: string
  role: string
  other: string
}

const users: User[] = [
  {
    email: 'admin@company.com',
    password: 'pass',
    name: 'นายยิ่งใหญ่ โอฬาร',
    role: 'admin',
    other: '...'
  },
  {
    email: 'user@company.com',
    password: 'pass',
    name: 'น.ส.ใช้งาน ทั่วไป',
    role: 'user',
    other: '...'
  },
  {
    email: 'manager@company.com',
    password: 'pass',
    name: 'นายบริหาร จัดการ',
    role: 'manager',
    other: '...'
  }
]

export type Credential = {
  token: string
  email: string
  name: string
  role: string
}

export const login = (
  email: string,
  pass: string
): Promise<Credential | string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          // find user by email, pass
          const user = users.find(
            (u) => u.email === email && u.password === pass
          )
          // user not found
          if (user === undefined) {
            reject('user not found')
            return
          }
          // user found
          const newCredential: Credential = {
            token: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            role: user.role
          }
          resolve(newCredential)
        } else {
          reject('connection refused')
        }
      }
    )
  })
}
export const logout = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() <= 0.8) {
        // .. remove credential
        resolve('success')
      } else {
        reject('connection refused')
      }
    }, 1000 + Math.random() * 2000);
  })
}