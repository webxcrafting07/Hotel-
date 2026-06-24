const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogsMap = {
  "complete-guide-to-jagannath-temple-puri": "Jagannath_Temple,_Puri",
  "day-trip-to-konark-sun-temple": "Konark_Sun_Temple",
  "top-5-hidden-beaches-near-puri": "Puri_Beach",
  "flavors-of-odisha-culinary-journey": "Odia_cuisine",
};

// Fallbacks for the ones we can't find on wikipedia
const fallbacks = {
  "experiencing-luxury-at-hotel-the-anand-puri": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200", // valid hotel image
  "top-wellness-benefits-ayurvedic-spa-retreat": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200", // valid spa image
};

async function updateImages() {
  const titles = Object.values(blogsMap).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=pageimages&format=json&pithumbsize=1200`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    
    const titleToUrl = {};
    for (const pageId in pages) {
      if (pages[pageId].thumbnail) {
        titleToUrl[pages[pageId].title.replace(/ /g, '_')] = pages[pageId].thumbnail.source;
      }
    }

    for (const slug of Object.keys(blogsMap)) {
      const wikiTitle = blogsMap[slug];
      // Sometimes Wikipedia returns title with spaces instead of underscores
      const key = Object.keys(titleToUrl).find(k => k.toLowerCase() === wikiTitle.toLowerCase().replace(/_/g, ' '));
      
      const imageUrl = titleToUrl[wikiTitle] || titleToUrl[key] || (wikiTitle === 'Odia_cuisine' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Odia_Thali.jpg/1200px-Odia_Thali.jpg' : null);
      
      if (imageUrl) {
        await prisma.blog.update({
          where: { slug },
          data: { coverImage: imageUrl }
        });
        console.log(`Updated ${slug} with ${imageUrl}`);
      }
    }

    // Update fallbacks
    for (const slug of Object.keys(fallbacks)) {
      await prisma.blog.update({
        where: { slug },
        data: { coverImage: fallbacks[slug] }
      });
      console.log(`Updated ${slug} with fallback ${fallbacks[slug]}`);
    }

    console.log("Images updated successfully!");
  } catch (error) {
    console.error("Error updating images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
