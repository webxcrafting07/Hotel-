import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogs = [
  {
    title: "A Complete Guide to Jagannath Temple, Puri",
    slug: "complete-guide-to-jagannath-temple-puri",
    excerpt: "Everything you need to know before visiting the sacred Jagannath Temple, from timings to rules and rituals.",
    content: `
      <p>The <strong>Jagannath Temple</strong> in Puri is one of the Char Dham pilgrimage sites for Hindus. This magnificent 12th-century temple is dedicated to Lord Jagannath, a form of Lord Vishnu.</p>
      
      <h3>Key Information for Visitors</h3>
      <ul>
        <li><strong>Timings:</strong> 5:00 AM to 11:00 PM (Timings may vary during special rituals).</li>
        <li><strong>Dress Code:</strong> Traditional Indian attire is highly recommended. Shorts, skirts, and sleeveless clothes are strictly prohibited.</li>
        <li><strong>Electronics:</strong> Mobile phones, cameras, and leather items are not allowed inside the temple premises. You can store them in lockers available outside.</li>
      </ul>

      <h3>The Mahaprasad</h3>
      <p>Do not leave without partaking in the <em>Mahaprasad</em>, cooked in the temple's massive kitchen using traditional earthen pots and firewood. It is considered highly auspicious and incredibly delicious.</p>

      <p>Visiting the Jagannath Temple is a deeply spiritual experience that brings you closer to the divine culture of Odisha.</p>
    `,
    category: "Culture",
    tags: ["puri", "temple", "jagannath", "spiritual"],
    coverImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200",
    metaTitle: "Jagannath Temple Puri Guide - Timings & Rules",
    metaDesc: "Plan your visit to the sacred Jagannath Temple in Puri with our comprehensive guide on timings, dress code, and the famous Mahaprasad.",
    viewCount: 1542
  },
  {
    title: "Top 5 Hidden Beaches Near Puri You Must Visit",
    slug: "top-5-hidden-beaches-near-puri",
    excerpt: "Escape the crowds of the main Puri beach and discover these serene, pristine coastal gems just a short drive away.",
    content: `
      <p>While the Golden Beach of Puri is famous worldwide, the coastline of Odisha hides several serene and less-crowded beaches perfect for those seeking peace and tranquility.</p>
      
      <h3>1. Balighai Beach</h3>
      <p>Located around 8 km from Puri, Balighai Beach is famous for its casuarina trees and pristine white sand. It's a great spot to watch the sunrise in absolute silence.</p>
      
      <h3>2. Chandrabhaga Beach</h3>
      <p>Situated near the Sun Temple of Konark, this beach offers a majestic view of the sea and is renowned for its cultural significance.</p>
      
      <h3>3. Ramchandi Beach</h3>
      <p>Named after the presiding deity Goddess Ramchandi, this beautiful beach is situated at the junction of the river Kushabhadra and the Bay of Bengal.</p>
      
      <p>Next time you stay at <strong>Hotel The Anand</strong>, ask our concierge to arrange a private cab for a pristine beach-hopping experience!</p>
    `,
    category: "Travel",
    tags: ["beaches", "nature", "puri", "travel"],
    coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200",
    metaTitle: "Hidden Beaches Near Puri - Peaceful Escapes",
    metaDesc: "Discover the top 5 hidden, pristine beaches near Puri for a peaceful and serene coastal escape away from the crowds.",
    viewCount: 985
  },
  {
    title: "The Flavors of Odisha: A Culinary Journey",
    slug: "flavors-of-odisha-culinary-journey",
    excerpt: "Dive into the rich, authentic, and diverse flavors of Odia cuisine. From Pakhala Bhata to Chenna Poda, explore what makes the local food so special.",
    content: `
      <p>Odia cuisine is a hidden gem in India's culinary landscape, characterized by its reliance on local ingredients, minimal use of spices, and incredibly flavorful results.</p>
      
      <h3>Pakhala Bhata</h3>
      <p>A quintessential Odia dish, Pakhala consists of cooked rice washed and lightly fermented in water. It is typically served with fried fish, potatoes, and <em>badi chura</em>. It's the perfect cooling meal for hot summer days.</p>
      
      <h3>Dalma</h3>
      <p>A nutritious and delicious dish made from roasted moong dal and a variety of vegetables like papaya, eggplant, and drumsticks. It is tempered with the local five-spice blend known as <em>Pancha Phutana</em>.</p>
      
      <h3>Chenna Poda</h3>
      <p>Known as the roasted cheese dessert of Odisha, Chenna Poda is made by baking homemade cottage cheese with sugar and nuts until it caramelizes into a rich, brown crust.</p>
      
      <p>At our multi-cuisine restaurant at Hotel The Anand, you can request an authentic Odia thali to experience these incredible flavors firsthand.</p>
    `,
    category: "Food",
    tags: ["food", "cuisine", "odisha", "dining"],
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200",
    metaTitle: "Authentic Odia Cuisine - Must Try Dishes",
    metaDesc: "Explore the authentic flavors of Odia cuisine, including Pakhala, Dalma, and Chenna Poda. A culinary journey through Odisha.",
    viewCount: 1204
  },
  {
    title: "Experiencing Luxury at Hotel The Anand Puri",
    slug: "experiencing-luxury-at-hotel-the-anand-puri",
    excerpt: "Discover why Hotel The Anand is the premier destination for luxury, comfort, and unmatched hospitality in the holy city of Puri.",
    content: `
      <p>Finding the perfect blend of modern luxury and traditional hospitality in a bustling pilgrimage city can be challenging. <strong>Hotel The Anand</strong> bridges this gap perfectly.</p>
      
      <h3>World-Class Amenities</h3>
      <p>From the moment you step into our grand lobby, you are treated to a 5-star experience. Our rooms are designed with aesthetic elegance, featuring premium bedding, smart controls, and panoramic views of the city and the sea.</p>
      
      <h3>Rejuvenate Your Senses</h3>
      <p>After a long day of temple visits and beach walks, our state-of-the-art spa offers authentic Ayurvedic massages to relax your body and mind. Follow it up with a refreshing dip in our temperature-controlled pool.</p>
      
      <p>We believe that luxury is in the details, and our dedicated 24/7 staff ensures your stay in Puri is nothing short of magical.</p>
    `,
    category: "Hotel News",
    tags: ["hotel", "luxury", "hospitality", "puri"],
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    metaTitle: "Luxury Stay in Puri - Hotel The Anand",
    metaDesc: "Experience unparalleled luxury and comfort at Hotel The Anand in Puri. Discover our world-class amenities and exceptional hospitality.",
    viewCount: 2311
  },
  {
    title: "A Day Trip to the Konark Sun Temple",
    slug: "day-trip-to-konark-sun-temple",
    excerpt: "Plan the perfect day trip from Puri to the architectural marvel and UNESCO World Heritage site, the Konark Sun Temple.",
    content: `
      <p>Just 35 kilometers from Puri lies one of India's most awe-inspiring monuments—the <strong>Konark Sun Temple</strong>. Designed in the shape of a colossal chariot for the Sun God, it is a testament to the incredible architectural prowess of ancient India.</p>
      
      <h3>The Architecture</h3>
      <p>The temple is structured with 24 intricately carved wheels and is pulled by seven majestic horses. Every inch of the temple is covered with detailed carvings depicting daily life, mythology, and nature.</p>
      
      <h3>Best Time to Visit</h3>
      <p>The best time to visit is early morning to catch the sunrise lighting up the temple, or in the late afternoon. Avoid the midday heat if traveling in summer.</p>
      
      <p>Our travel desk at Hotel The Anand can easily arrange a comfortable air-conditioned cab and a knowledgeable guide for your Konark excursion.</p>
    `,
    category: "Travel",
    tags: ["konark", "temple", "unesco", "heritage"],
    coverImage: "https://images.unsplash.com/photo-1600096647960-917bb39688de?w=1200",
    metaTitle: "Konark Sun Temple Day Trip Guide",
    metaDesc: "Plan your day trip from Puri to the majestic Konark Sun Temple. Architecture, tips, and the best time to visit this UNESCO World Heritage site.",
    viewCount: 1876
  },
  {
    title: "Top Wellness Benefits of an Ayurvedic Spa Retreat",
    slug: "top-wellness-benefits-ayurvedic-spa-retreat",
    excerpt: "Unwind and heal your body and soul. Learn about the incredible benefits of traditional Ayurvedic spa treatments.",
    content: `
      <p>In today's fast-paced world, taking a moment to pause and heal is not a luxury, but a necessity. Ayurvedic spa treatments offer a holistic approach to wellness that rejuvenates both the body and the mind.</p>
      
      <h3>Detoxification</h3>
      <p>Traditional therapies like <em>Abhyanga</em> (warm oil massage) help stimulate the lymphatic system, flushing out toxins and improving blood circulation.</p>
      
      <h3>Stress Relief</h3>
      <p>Therapies such as <em>Shirodhara</em>, where warm oil is gently poured over the forehead, are incredibly effective in reducing anxiety, treating insomnia, and calming the central nervous system.</p>
      
      <p>Book a session at our in-house luxury Spa during your stay at Hotel The Anand and experience these profound healing benefits for yourself.</p>
    `,
    category: "Lifestyle",
    tags: ["spa", "wellness", "ayurveda", "health"],
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
    metaTitle: "Ayurvedic Spa Benefits - Holistic Wellness",
    metaDesc: "Discover the amazing health and stress-relief benefits of traditional Ayurvedic spa treatments and massages.",
    viewCount: 843
  }
];

async function seed() {
  try {
    const user = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (!user) {
      console.log("No SUPER_ADMIN user found to assign blogs to.");
      return;
    }

    for (const blogData of blogs) {
      const existing = await prisma.blog.findUnique({ where: { slug: blogData.slug } });
      if (!existing) {
        await prisma.blog.create({
          data: {
            ...blogData,
            authorId: user.id,
            isPublished: true,
            publishedAt: new Date()
          }
        });
        console.log(`Created blog: ${blogData.title}`);
      } else {
        console.log(`Blog already exists: ${blogData.title}`);
      }
    }

    console.log("Blog seeding complete!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
