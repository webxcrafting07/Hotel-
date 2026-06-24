const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.blog.update({
    where: { slug: "day-trip-to-konark-sun-temple" },
    data: { coverImage: "https://images.unsplash.com/photo-1600096647960-917bb39688de?w=1200" }
  });
  await prisma.blog.update({
    where: { slug: "flavors-of-odisha-culinary-journey" },
    data: { coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200" }
  });
  console.log("Fixed!");
}
fix();
