import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepo from "../persistence/users.persistence.js";
const PEPPER = process.env.PASSWORD_PEPPER || "";

function getPepperedPassword(plain) {
  const pepper = process.env.PASSWORD_PEPPER || "";
  return `${plain}${pepper}`;
}

export async function getAllUsers(query) {
  const { rows, count, page, limit } = await userRepo.getAllUsers(query);

  const totalPages = Math.ceil(count / limit) || 1;
  return {
    data: rows,
    meta: { page, limit, total: count, totalPages },
  };
}

export async function getUserById(id) {
  return await userRepo.findById(id);
}

export async function createUser(payload) {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new Error("name, email, and password are required");
  }

  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const saltedHash = await bcrypt.hash(getPepperedPassword(password), rounds);

  const data = {
    name,
    email: String(email).toLowerCase().trim(),
    password: saltedHash,
    role: "user",
  };
  const created = await userRepo.create(data);
  const { password: _, ...safe } = created.toJSON();
  return safe;
}

export async function updateUser(id, userData) {
  if ("role" in userData) delete userData.role;
  if ("password" in userData && userData.password) {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    userData.password = await bcrypt.hash(
      getPepperedPassword(userData.password),
      rounds
    );
  }
  const updated = await userRepo.update(id, userData);
  return updated ? (({ password, ...rest }) => rest)(updated.toJSON()) : null;
}

export async function deleteUser(id) {
  return await userRepo.remove(id);
}

export async function login(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password + PEPPER, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const payload = { id: user.id, name: user.name, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}
