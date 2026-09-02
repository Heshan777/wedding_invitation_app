const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  const guests = await prisma.guest.findMany();
  console.log("SUCCESS! Guests in SQLite database:", guests.length);
  guests.forEach((g) => {
    console.log(` - ${g.salutation} ${g.displayName} (Table #${g.tableNumber}, Link: /invite/${g.token})`);
  });

  const settings = await prisma.eventSettings.findUnique({ where: { id: "singleton" } });
  console.log("SUCCESS! Couple:", settings.coupleNames, "| Venue:", settings.venueName);
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
