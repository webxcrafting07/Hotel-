const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.blog.update({
    where: { slug: "day-trip-to-konark-sun-temple" },
    data: { coverImage: "/blogs/konark.png" }
  });
  await prisma.blog.update({
    where: { slug: "flavors-of-odisha-culinary-journey" },
    data: { coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800" }
  });
  console.log("Fixed locally and unsplash!");
}
fix();
