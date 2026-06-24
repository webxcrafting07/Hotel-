"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin } from "lucide-react"

const ATTRACTIONS = [
  { name: "Shree Jagannath Temple", distance: "2.5 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/960px-Shri_Jagannath_temple.jpg", desc: "One of the Char Dham pilgrimage sites." },
  { name: "Puri Golden Beach", distance: "500 m", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Puri_Sea_Beach_viewed_from_the_light_house.jpg/960px-Puri_Sea_Beach_viewed_from_the_light_house.jpg", desc: "Golden sands and breathtaking sunrises." },
  { name: "Konark Sun Temple", distance: "35 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/960px-Konarka_Temple.jpg", desc: "13th-century UNESCO World Heritage Site." },
  { name: "Chilika Lake", distance: "50 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Birds_eyeview_of_Chilika_Lake.jpg/960px-Birds_eyeview_of_Chilika_Lake.jpg", desc: "Largest coastal lagoon in India with Irrawaddy dolphins." },
  { name: "Raghurajpur Artist Village", distance: "14 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Entrance_of_Raghurajpur.jpg/960px-Entrance_of_Raghurajpur.jpg", desc: "Heritage village known for Pattachitra scroll paintings." },
  { name: "Gundicha Temple", distance: "3 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gundicha_Temple%2C_Puri%2C_Odisha1.JPG/960px-Gundicha_Temple%2C_Puri%2C_Odisha1.JPG", desc: "The destination of the famous Rath Yatra." },
  { name: "Odisha State Museum", distance: "60 km", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bhubaneswar_State_Museum.jpg/960px-Bhubaneswar_State_Museum.jpg", desc: "A premier museum showcasing Odisha's rich heritage." },
  { name: "Pipili Applique Village", distance: "36 km", image: "/images/attractions/pipili.png", desc: "Famous for vibrant applique handicrafts." },
  { name: "Sakshigopal Temple", distance: "20 km", image: "/images/attractions/sakshigopal.png", desc: "A famous temple dedicated to Lord Gopinath." },
  { name: "Lingaraj Temple", distance: "60 km", image: "/images/attractions/lingaraj.png", desc: "An architectural marvel and largest temple in Bhubaneswar." },
]

export function NearbyAttractions() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-gold-500 font-medium tracking-widest uppercase mb-4 text-sm">
            — Explore Puri
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-gray-900 mb-6">
            Nearby Attractions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ATTRACTIONS.map((spot, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative h-48">
                <img src={spot.image} alt={spot.name} className="object-cover w-full h-full" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-500" />
                  {spot.distance}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{spot.name}</h3>
                <p className="text-sm text-gray-600">{spot.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
