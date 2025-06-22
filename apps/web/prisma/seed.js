const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  await db.user.createMany({
    data: [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob",   email: "bob@example.com"   },
      { id: "3", name: "Carol", email: "carol@example.com" },
      { id: "4", name: "David", email: "david@example.com" },
      { id: "5", name: "Eve",   email: "eve@example.com"   },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
