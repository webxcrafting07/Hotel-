const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.blog.update({
    where: { slug: "day-trip-to-konark-sun-temple" },
    data: { coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/800px-Konarka_Temple.jpg" }
  });
  await prisma.blog.update({
    where: { slug: "flavors-of-odisha-culinary-journey" },
    data: { coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Odia_Thali.jpg/800px-Odia_Thali.jpg" }
  });
  console.log("Fixed with 800px!");
}
fix();
