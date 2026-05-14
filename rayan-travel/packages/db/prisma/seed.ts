import { PrismaClient, ListingType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const hotels = [
  { slug: 'burj-al-arab-dubai', name: 'Burj Al Arab', location: 'Dubai, UAE', price: 1500, description: 'Standing on its own island, the Burj Al Arab is one of the most luxurious hotels in the world.', images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Beach Access'], rooms: 202, rating: 9.6 } },
  { slug: 'hotel-george-v-paris', name: 'Four Seasons George V', location: 'Paris, France', price: 950, description: 'Epitome of Parisian luxury, steps from the Champs-Élysées with legendary art and cuisine.', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Concierge', 'Bar'], rooms: 244, rating: 9.4 } },
  { slug: 'the-ritz-london', name: 'The Ritz London', location: 'London, UK', price: 800, description: 'An icon of British luxury since 1906, The Ritz London offers timeless elegance in Piccadilly.', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'], metadata: { stars: 5, amenities: ['Restaurant', 'Bar', 'Spa', 'WiFi', 'Concierge', 'Butler'], rooms: 136, rating: 9.2 } },
  { slug: 'marina-bay-sands-singapore', name: 'Marina Bay Sands', location: 'Singapore', price: 600, description: 'Iconic hotel with a rooftop infinity pool overlooking the Singapore skyline.', images: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'], metadata: { stars: 5, amenities: ['Infinity Pool', 'Casino', 'Spa', 'Restaurant', 'WiFi', 'Mall Access'], rooms: 2561, rating: 9.1 } },
  { slug: 'riad-kniza-marrakech', name: 'Riad Kniza', location: 'Marrakech, Morocco', price: 280, description: 'A 18th-century palace in the heart of the Marrakech medina, offering authentic Moroccan luxury.', images: ['https://images.unsplash.com/photo-1539437829697-1b4ed5aebd86?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Hammam', 'Restaurant', 'WiFi', 'Rooftop', 'Courtyard'], rooms: 11, rating: 9.5 } },
  { slug: 'hotel-arts-barcelona', name: 'Hotel Arts Barcelona', location: 'Barcelona, Spain', price: 420, description: 'A 44-story skyscraper on the Barcelona beachfront, offering spectacular sea views.', images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Beach', 'Restaurant', 'WiFi', 'Gym'], rooms: 483, rating: 9.0 } },
  { slug: 'park-hyatt-tokyo', name: 'Park Hyatt Tokyo', location: 'Tokyo, Japan', price: 650, description: 'Occupying the top 14 floors of the Shinjuku Park Tower, with panoramic city and Mount Fuji views.', images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Library'], rooms: 177, rating: 9.3 } },
  { slug: 'hotel-hassler-rome', name: 'Hotel Hassler Roma', location: 'Rome, Italy', price: 700, description: 'Perched atop the Spanish Steps, offering legendary luxury and panoramic views over the Eternal City.', images: ['https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&q=80'], metadata: { stars: 5, amenities: ['Rooftop Restaurant', 'Spa', 'Bar', 'WiFi', 'Concierge', 'Terrace'], rooms: 87, rating: 9.1 } },
  { slug: 'como-uma-ubud-bali', name: 'COMO Uma Ubud', location: 'Ubud, Bali', price: 380, description: 'Nestled in a rainforest valley in the cultural heart of Bali, with infinity pools and jungle views.', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Yoga', 'Cycling'], rooms: 46, rating: 9.4 } },
  { slug: 'sofitel-casablanca', name: 'Sofitel Casablanca Tour Blanche', location: 'Casablanca, Morocco', price: 220, description: 'Luxurious city hotel in the heart of Casablanca, blending Moroccan tradition with French elegance.', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Business Center', 'Gym'], rooms: 135, rating: 8.8 } },
  { slug: 'the-plaza-new-york', name: 'The Plaza Hotel', location: 'New York, USA', price: 850, description: 'An iconic landmark on Central Park South, The Plaza has been the address of choice since 1907.', images: ['https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800&q=80'], metadata: { stars: 5, amenities: ['Spa', 'Restaurant', 'Bar', 'WiFi', 'Concierge', 'Gym'], rooms: 282, rating: 9.0 } },
  { slug: 'le-bristol-paris', name: 'Le Bristol Paris', location: 'Paris, France', price: 1100, description: 'A palace hotel on Rue du Faubourg Saint-Honoré with an exquisite rooftop pool and Michelin-starred dining.', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'], metadata: { stars: 5, amenities: ['Rooftop Pool', 'Spa', 'Restaurant', 'WiFi', 'Butler', 'Garden'], rooms: 188, rating: 9.5 } },
  { slug: 'aman-tokyo', name: 'Aman Tokyo', location: 'Tokyo, Japan', price: 1200, description: 'Urban sanctuary in the heart of Tokyo, occupying the top six floors of the Otemachi Tower.', images: ['https://images.unsplash.com/photo-1621275471769-b5b4d9a5c7a2?w=800&q=80'], metadata: { stars: 5, amenities: ['Spa', 'Pool', 'Restaurant', 'WiFi', 'Gym', 'Tea Ceremony'], rooms: 84, rating: 9.6 } },
  { slug: 'atlantis-palm-dubai', name: 'Atlantis The Palm', location: 'Dubai, UAE', price: 450, description: 'Iconic resort on the Palm Jumeirah with a waterpark, aquarium and over 23 restaurants and bars.', images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80'], metadata: { stars: 5, amenities: ['Waterpark', 'Beach', 'Pool', 'Aquarium', 'WiFi', 'Casino'], rooms: 1548, rating: 8.9 } },
  { slug: 'villa-magna-madrid', name: 'Hotel Villa Magna', location: 'Madrid, Spain', price: 520, description: 'Madrid\'s most exclusive address on Paseo de la Castellana, combining elegance with world-class service.', images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'], metadata: { stars: 5, amenities: ['Spa', 'Restaurant', 'Bar', 'WiFi', 'Concierge', 'Garden'], rooms: 150, rating: 9.2 } },
  { slug: 'anantara-golden-triangle', name: 'Anantara Golden Triangle', location: 'Chiang Rai, Thailand', price: 350, description: 'Stunning resort at the intersection of Thailand, Myanmar, and Laos, with elephant camp experiences.', images: ['https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80'], metadata: { stars: 5, amenities: ['Elephant Camp', 'Pool', 'Spa', 'Restaurant', 'WiFi', 'Trekking'], rooms: 77, rating: 9.3 } },
  { slug: 'belmond-copacabana-palace', name: 'Belmond Copacabana Palace', location: 'Rio de Janeiro, Brazil', price: 480, description: 'The grande dame of Rio de Janeiro, overlooking the world-famous Copacabana beach since 1923.', images: ['https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80'], metadata: { stars: 5, amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Beach Access'], rooms: 239, rating: 9.0 } },
  { slug: 'six-senses-douro-valley', name: 'Six Senses Douro Valley', location: 'Porto, Portugal', price: 560, description: 'A 19th-century manor house in the heart of the Douro Valley wine region, surrounded by terraced vineyards.', images: ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'], metadata: { stars: 5, amenities: ['Spa', 'Pool', 'Winery', 'Restaurant', 'WiFi', 'Yoga'], rooms: 57, rating: 9.4 } },
  { slug: 'st-regis-maldives', name: 'The St. Regis Maldives Vommuli', location: 'Maldives', price: 2200, description: 'Private island resort with over-water bungalows, house reef diving, and a dolphin-shaped island.', images: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80'], metadata: { stars: 5, amenities: ['Overwater Bungalows', 'Diving', 'Spa', 'Restaurant', 'WiFi', 'Private Beach'], rooms: 77, rating: 9.7 } },
  { slug: 'rosewood-london', name: 'Rosewood London', location: 'London, UK', price: 720, description: 'A 1914 Edwardian Belle Époque landmark in Holborn, home to the acclaimed Holborn Dining Room.', images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80'], metadata: { stars: 5, amenities: ['Spa', 'Restaurant', 'Bar', 'WiFi', 'Gym', 'Courtyard'], rooms: 306, rating: 9.1 } },
]

const tours = [
  { slug: 'desert-safari-dubai', name: 'Dubai Desert Safari', location: 'Dubai, UAE', price: 120, description: 'Experience the Arabian desert with dune bashing, camel riding, and a traditional Bedouin camp dinner.', images: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80'], metadata: { duration: '6 hours', groupSize: 12, includes: ['Transport', 'Dinner', 'Entertainment', 'Camel Ride'], rating: 4.8 } },
  { slug: 'eiffel-tower-paris-tour', name: 'Paris Icons & Eiffel Tower', location: 'Paris, France', price: 89, description: 'Skip-the-line access to the Eiffel Tower summit with a guided tour of Paris\'s most iconic landmarks.', images: ['https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80'], metadata: { duration: '4 hours', groupSize: 20, includes: ['Skip-line Ticket', 'Guide', 'Summit Access'], rating: 4.9 } },
  { slug: 'colosseum-rome-tour', name: 'Colosseum & Ancient Rome', location: 'Rome, Italy', price: 75, description: 'Priority access to the Colosseum, Roman Forum, and Palatine Hill with an expert archaeologist guide.', images: ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'], metadata: { duration: '3 hours', groupSize: 15, includes: ['Priority Access', 'Expert Guide', 'Forum & Palatine'], rating: 4.9 } },
  { slug: 'mount-fuji-tokyo-day-trip', name: 'Mount Fuji Day Trip', location: 'Tokyo, Japan', price: 150, description: 'Full-day excursion to Mount Fuji with visits to Lake Kawaguchi and the iconic 5th Station.', images: ['https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80'], metadata: { duration: '12 hours', groupSize: 25, includes: ['Transport', 'Guide', 'Lunch', 'Cable Car'], rating: 4.7 } },
  { slug: 'bali-temples-rice-terraces', name: 'Bali Temples & Tegallalang Rice Terraces', location: 'Ubud, Bali', price: 65, description: 'Visit iconic Bali temples including Tanah Lot and the stunning Tegallalang rice terraces at sunrise.', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], metadata: { duration: '8 hours', groupSize: 10, includes: ['Transport', 'Guide', 'Temple Fees', 'Lunch'], rating: 4.8 } },
  { slug: 'marrakech-medina-souk-tour', name: 'Marrakech Medina & Souks', location: 'Marrakech, Morocco', price: 45, description: 'Navigate the vibrant souks of the Marrakech medina with a local guide, visiting spice markets and artisan workshops.', images: ['https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80'], metadata: { duration: '4 hours', groupSize: 8, includes: ['Local Guide', 'Mint Tea', 'Cooking Demo'], rating: 4.9 } },
  { slug: 'barcelona-tapas-wine-tour', name: 'Barcelona Tapas & Wine Night Tour', location: 'Barcelona, Spain', price: 95, description: 'Explore Barcelona\'s best tapas bars and wine cellars in El Born and Gothic Quarter with a foodie guide.', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], metadata: { duration: '3.5 hours', groupSize: 12, includes: ['8 Tapas', 'Wine Pairings', 'Local Guide'], rating: 4.8 } },
  { slug: 'new-york-helicopter-tour', name: 'NYC Helicopter Tour', location: 'New York, USA', price: 250, description: 'Soar above Manhattan in a helicopter and see the Statue of Liberty, Central Park, and the skyline.', images: ['https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80'], metadata: { duration: '15 minutes', groupSize: 6, includes: ['Helicopter Flight', 'Hotel Transfer', 'Champagne'], rating: 4.9 } },
  { slug: 'london-thames-cruise', name: 'London Thames Sunset Cruise', location: 'London, UK', price: 55, description: 'Cruise along the Thames at sunset, passing the Tower of London, Houses of Parliament, and Greenwich.', images: ['https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'], metadata: { duration: '2 hours', groupSize: 40, includes: ['Welcome Drink', 'Commentary', 'Dinner Option'], rating: 4.7 } },
  { slug: 'singapore-night-safari', name: 'Singapore Night Safari', location: 'Singapore', price: 80, description: 'The world\'s first nocturnal zoo, home to 900 animals across 7 geographical zones.', images: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'], metadata: { duration: '3 hours', groupSize: 30, includes: ['Entry Ticket', 'Tram Ride', 'Fire Show'], rating: 4.6 } },
]

const flights = [
  { slug: 'cdg-dxb-af-001', name: 'Paris → Dubai', location: 'CDG → DXB', price: 580, description: 'Air France direct flight from Paris Charles de Gaulle to Dubai International Airport.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Air France', flightNumber: 'AF 966', departure: '10:30', arrival: '20:45', duration: '7h15', class: 'Economy', stops: 0, aircraft: 'Boeing 777' } },
  { slug: 'lhr-jfk-ba-002', name: 'London → New York', location: 'LHR → JFK', price: 720, description: 'British Airways non-stop service from London Heathrow to New York JFK.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'British Airways', flightNumber: 'BA 175', departure: '11:00', arrival: '13:55', duration: '7h55', class: 'Economy', stops: 0, aircraft: 'Boeing 747' } },
  { slug: 'nrt-sin-sq-003', name: 'Tokyo → Singapore', location: 'NRT → SIN', price: 480, description: 'Singapore Airlines premium service from Tokyo Narita to Singapore Changi.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Singapore Airlines', flightNumber: 'SQ 638', departure: '00:05', arrival: '05:40', duration: '7h35', class: 'Economy', stops: 0, aircraft: 'Airbus A380' } },
  { slug: 'cmn-cdg-at-004', name: 'Casablanca → Paris', location: 'CMN → CDG', price: 220, description: 'Royal Air Maroc direct flight from Mohammed V International to Paris Charles de Gaulle.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Royal Air Maroc', flightNumber: 'AT 800', departure: '07:15', arrival: '10:45', duration: '3h30', class: 'Economy', stops: 0, aircraft: 'Boeing 737' } },
  { slug: 'dxb-bkk-ek-005', name: 'Dubai → Bangkok', location: 'DXB → BKK', price: 390, description: 'Emirates award-winning service from Dubai International to Bangkok Suvarnabhumi.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Emirates', flightNumber: 'EK 372', departure: '02:30', arrival: '13:10', duration: '6h40', class: 'Economy', stops: 0, aircraft: 'Airbus A380' } },
  { slug: 'jfk-bcn-ib-006', name: 'New York → Barcelona', location: 'JFK → BCN', price: 650, description: 'Iberia connecting flight via Madrid from New York JFK to Barcelona El Prat.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Iberia', flightNumber: 'IB 3204', departure: '19:00', arrival: '11:30+1', duration: '9h30', class: 'Economy', stops: 1, aircraft: 'Airbus A350' } },
  { slug: 'cdg-nrt-af-007', name: 'Paris → Tokyo', location: 'CDG → NRT', price: 890, description: 'Air France direct service from Paris Charles de Gaulle to Tokyo Narita.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Air France', flightNumber: 'AF 274', departure: '13:30', arrival: '09:20+1', duration: '11h50', class: 'Economy', stops: 0, aircraft: 'Boeing 777' } },
  { slug: 'lhr-dxb-ek-008', name: 'London → Dubai', location: 'LHR → DXB', price: 520, description: 'Emirates flagship A380 service from London Heathrow to Dubai International.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Emirates', flightNumber: 'EK 004', departure: '21:30', arrival: '07:55+1', duration: '7h25', class: 'Economy', stops: 0, aircraft: 'Airbus A380' } },
  { slug: 'fcо-jfk-az-009', name: 'Rome → New York', location: 'FCO → JFK', price: 780, description: 'ITA Airways non-stop flight from Rome Fiumicino to New York JFK.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'ITA Airways', flightNumber: 'AZ 608', departure: '10:15', arrival: '13:30', duration: '10h15', class: 'Economy', stops: 0, aircraft: 'Airbus A330' } },
  { slug: 'sin-syd-sq-010', name: 'Singapore → Sydney', location: 'SIN → SYD', price: 560, description: 'Singapore Airlines service from Singapore Changi to Sydney Kingsford Smith Airport.', images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'], metadata: { airline: 'Singapore Airlines', flightNumber: 'SQ 231', departure: '09:05', arrival: '20:05', duration: '8h00', class: 'Economy', stops: 0, aircraft: 'Airbus A350' } },
]

const cars = [
  { slug: 'mercedes-s-class-dubai', name: 'Mercedes S-Class', location: 'Dubai, UAE', price: 250, description: 'Ultimate luxury sedan with chauffeur, perfect for business travel or special occasions in Dubai.', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'], metadata: { brand: 'Mercedes-Benz', model: 'S 500', year: 2025, seats: 4, transmission: 'Automatic', fuel: 'Hybrid', ac: true, category: 'Luxury' } },
  { slug: 'range-rover-london', name: 'Range Rover Sport', location: 'London, UK', price: 180, description: 'Premium SUV ideal for exploring London and the British countryside in style and comfort.', images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'], metadata: { brand: 'Land Rover', model: 'Range Rover Sport', year: 2025, seats: 5, transmission: 'Automatic', fuel: 'Diesel', ac: true, category: 'SUV' } },
  { slug: 'ferrari-488-paris', name: 'Ferrari 488 GTB', location: 'Paris, France', price: 800, description: 'Experience the thrill of driving a Ferrari through the streets of Paris and beyond.', images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'], metadata: { brand: 'Ferrari', model: '488 GTB', year: 2024, seats: 2, transmission: 'Automatic', fuel: 'Petrol', ac: true, category: 'Supercar' } },
  { slug: 'bmw-7-series-barcelona', name: 'BMW 7 Series', location: 'Barcelona, Spain', price: 160, description: 'Executive sedan combining performance and luxury for comfortable travel around Barcelona.', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'], metadata: { brand: 'BMW', model: '745Le', year: 2025, seats: 5, transmission: 'Automatic', fuel: 'Hybrid', ac: true, category: 'Executive' } },
  { slug: 'toyota-alphard-tokyo', name: 'Toyota Alphard VIP', location: 'Tokyo, Japan', price: 200, description: 'Japan\'s premier luxury MPV, the preferred vehicle for VIP transportation in Tokyo.', images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'], metadata: { brand: 'Toyota', model: 'Alphard Executive Lounge', year: 2025, seats: 7, transmission: 'Automatic', fuel: 'Hybrid', ac: true, category: 'MPV' } },
]

async function main() {
  console.log('🌱 Seeding database...')

  const adminPassword = await bcrypt.hash('Admin@Rayan2026', 12)
  await prisma.user.upsert({
    where: { email: 'admin@rayantravel.com' },
    update: {},
    create: {
      email: 'admin@rayantravel.com',
      name: 'Admin Rayan',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const demoPassword = await bcrypt.hash('Demo@User2026', 12)
  await prisma.user.upsert({
    where: { email: 'demo@rayantravel.com' },
    update: {},
    create: {
      email: 'demo@rayantravel.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
    },
  })

  for (const hotel of hotels) {
    await prisma.listing.upsert({
      where: { slug: hotel.slug },
      update: {},
      create: { ...hotel, type: 'HOTEL', price: hotel.price },
    })
  }

  for (const tour of tours) {
    await prisma.listing.upsert({
      where: { slug: tour.slug },
      update: {},
      create: { ...tour, type: 'TOUR', price: tour.price },
    })
  }

  for (const flight of flights) {
    await prisma.listing.upsert({
      where: { slug: flight.slug },
      update: {},
      create: { ...flight, type: 'FLIGHT', price: flight.price },
    })
  }

  for (const car of cars) {
    await prisma.listing.upsert({
      where: { slug: car.slug },
      update: {},
      create: { ...car, type: 'CAR', price: car.price },
    })
  }

  console.log(`✅ Seeded: ${hotels.length} hotels, ${tours.length} tours, ${flights.length} flights, ${cars.length} cars`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
