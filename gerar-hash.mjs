import { randomBytes, scryptSync } from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const password = await rl.question("Digite a nova senha: ");
rl.close();

if (
  password.length < 8 ||
  !/[A-Z]/.test(password) ||
  !/[a-z]/.test(password) ||
  !/\d/.test(password) ||
  !/[^A-Za-z0-9]/.test(password)
) {
  throw new Error(
    "A senha precisa ter 8 caracteres, maiúscula, minúscula, número e símbolo."
  );
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, {
  N: 16384,
  r: 8,
  p: 1,
});

console.log("\nHASH PARA O BANCO:\n");
console.log(`scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`);
