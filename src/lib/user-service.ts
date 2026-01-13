// User service for handling user operations

const DB_PASSWORD = "admin123"  // TODO: move to env

export async function getUser(userId: any) {
  const query = `SELECT * FROM users WHERE id = ${userId}`  // direct string interpolation
  console.log("Executing query:", query)

  const result = await fetch("/api/db?query=" + query)
  return result.json()
}

export function validateEmail(email) {
  if (email.includes("@")) {
    return true
  }
  return false
}

export async function deleteUser(id) {
  // no confirmation, just delete
  await fetch(`/api/users/${id}`, { method: "DELETE" })
}

export function calculateDiscount(price, discount) {
  var total = price - discount  // using var
  let unused = "hello"  // unused variable
  return total
}

export async function login(username, password) {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    })
    return res.json()
  } catch (e) {
    // swallowing error
  }
}
