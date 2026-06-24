const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const contentJagannath = `
<p>The <strong>Jagannath Temple</strong> in Puri is one of the Char Dham pilgrimage sites for Hindus. This magnificent 12th-century temple is dedicated to Lord Jagannath, a form of Lord Vishnu, and stands as a monumental representation of Kalinga architecture.</p>

<h3>The Architectural Marvel</h3>
<p>Rising to a height of 214 feet from the ground level, the temple is one of the tallest monuments in the Indian subcontinent. The temple complex covers an area of over 400,000 square feet and is surrounded by a high fortified wall known as Meghanada Pacheri. Inside the main temple, you will find intricate carvings that tell tales from the Puranas and the Mahabharata.</p>

<blockquote>
  "To visit Puri and witness the divine presence of Lord Jagannath is to experience the very soul of India's spiritual heritage."
</blockquote>

<h3>Key Information for Visitors</h3>
<ul>
  <li><strong>Timings:</strong> 5:00 AM to 11:00 PM (Timings may vary during special rituals and festivals).</li>
  <li><strong>Dress Code:</strong> Traditional Indian attire is strictly recommended. Men are expected to wear dhotis or formal trousers, while women should wear sarees or salwar kameez. Shorts, skirts, and sleeveless clothes are strictly prohibited.</li>
  <li><strong>Electronics:</strong> Mobile phones, cameras, smartwatches, and leather items are not allowed inside the temple premises. You can safely store them in lockers available outside the main gate.</li>
</ul>

<h3>The Sacred Mahaprasad</h3>
<p>Do not leave without partaking in the <em>Mahaprasad</em>. Cooked in the temple's massive traditional kitchen using purely earthen pots and firewood, the food is first offered to Lord Jagannath before being distributed to thousands of devotees daily. It consists of 56 different items (Chhappan Bhog) and is considered highly auspicious and incredibly delicious.</p>

<p>Visiting the Jagannath Temple is a deeply spiritual experience that brings you closer to the divine culture of Odisha. Stay with us at Hotel The Anand, and our travel desk will ensure you have a seamless and guided tour of the temple.</p>
`;

const contentLuxury = `
<p>Finding the perfect blend of modern luxury and traditional hospitality in a bustling pilgrimage city can be challenging. <strong>Hotel The Anand</strong> bridges this gap perfectly, offering an oasis of calm and opulence just minutes away from Puri's main attractions.</p>

<h3>World-Class Amenities</h3>
<p>From the moment you step into our grand lobby, you are treated to a 5-star experience. Our rooms are designed with aesthetic elegance, featuring premium bedding, smart ambient lighting, and panoramic views of the city and the Bay of Bengal.</p>
<p>Every room is equipped with high-speed Wi-Fi, a fully stocked minibar, and a luxurious en-suite bathroom featuring premium organic toiletries and a rain shower.</p>

<blockquote>
  "Hotel The Anand isn't just a place to stay; it's a destination that redefines luxury in the heart of Puri."
</blockquote>

<h3>Rejuvenate Your Senses</h3>
<p>After a long day of temple visits and beach walks, our state-of-the-art spa offers authentic Ayurvedic massages to relax your body and mind. Our expert therapists use traditional oils and techniques to provide holistic healing.</p>
<p>Follow your spa session with a refreshing dip in our temperature-controlled infinity pool, offering stunning sunset views.</p>

<h3>Exquisite Dining</h3>
<p>Our multi-cuisine restaurant serves everything from authentic Odia delicacies to continental favorites. Our master chefs source the freshest local ingredients to craft culinary masterpieces that will delight your palate.</p>

<p>We believe that luxury is in the details. Our dedicated 24/7 staff ensures your stay in Puri is nothing short of magical. Book your suite today and experience the pinnacle of hospitality.</p>
`;

async function enrich() {
  await prisma.blog.update({
    where: { slug: "complete-guide-to-jagannath-temple-puri" },
    data: { content: contentJagannath }
  });
  await prisma.blog.update({
    where: { slug: "experiencing-luxury-at-hotel-the-anand-puri" },
    data: { content: contentLuxury }
  });
  console.log("Enriched!");
}
enrich();
