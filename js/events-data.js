/**
 * K-Explore Events - Event Catalog Data
 * Realistic upcoming events with dynamic dates, speakers, and agendas.
 */

// Helper to generate dynamic future dates relative to today
function getFutureDate(daysAhead, hour = 10, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const CATEGORIES = [
  { id: 'all', label: 'All Events', icon: 'sparkles' },
  { id: 'tech', label: 'Tech & AI', icon: 'cpu' },
  { id: 'music', label: 'Music & Arts', icon: 'music' },
  { id: 'business', label: 'Business & Startups', icon: 'briefcase' },
  { id: 'workshop', label: 'Workshops', icon: 'book-open' },
  { id: 'gaming', label: 'Gaming & Esports', icon: 'gamepad' },
  { id: 'sports', label: 'Sports & Fitness', icon: 'activity' }
];

export const INITIAL_EVENTS = [
  {
    id: 'kx-tech-01',
    title: 'NextGen AI & Cloud Summit 2026',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    date: getFutureDate(3, 9, 30),
    time: '09:30 AM - 05:00 PM',
    venue: 'Cyber City Convention Hall, Tech Hub',
    city: 'Bangalore / Virtual',
    locationType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'Explore generative AI breakthroughs, autonomous agents, and enterprise cloud architectures with industry pioneers.',
    fullDesc: 'Join thousands of developers, researchers, and tech leaders at the premier AI gathering of 2026. This summit dives deep into multimodal foundation models, agentic workflows, scalable cloud infrastructure, and ethical AI deployment. Features hands-on architectural code-labs and live benchmark demos.',
    featured: true,
    price: 'Free',
    totalSeats: 150,
    registeredCount: 118,
    tags: ['Artificial Intelligence', 'Cloud', 'Machine Learning', 'NextGen'],
    speakers: [
      { name: 'Dr. Elena Rostova', role: 'Head of AI Research', company: 'NovaTech AI', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Devon Vance', role: 'Distinguished Cloud Architect', company: 'HyperScale Labs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '09:30 AM', title: 'Keynote: The Agentic Revolution', desc: 'Autonomous intelligence transforming modern software systems.' },
      { time: '11:30 AM', title: 'Panel: Scaling Cloud Workloads for LLMs', desc: 'Hardware, GPU clusters, and latency optimization techniques.' },
      { time: '02:00 PM', title: 'Interactive Workshop: Multi-Agent Swarms', desc: 'Live hands-on coding session building collaborative agent workflows.' }
    ]
  },
  {
    id: 'kx-music-02',
    title: 'Neon Odyssey: Electronic Music Festival',
    category: 'music',
    categoryLabel: 'Music & Arts',
    date: getFutureDate(7, 18, 0),
    time: '06:00 PM - 01:00 AM',
    venue: 'Skyline Amphitheatre, Bayfront Grounds',
    city: 'Mumbai',
    locationType: 'In-Person',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'An immersive audio-visual spectacle featuring top international DJs, holographic stages, and live synthwave beats.',
    fullDesc: 'Neon Odyssey combines world-class electronic music producers with mind-bending laser projections and spatial acoustics. Featuring 3 distinct stages—Cosmic Pulse, Retro Wave, and Deep Horizons. Food trucks, interactive light sculptures, and chillout lounges included.',
    featured: true,
    price: '₹799',
    totalSeats: 300,
    registeredCount: 264,
    tags: ['EDM', 'Live Music', 'Visual Arts', 'Nightlife'],
    speakers: [
      { name: 'Aetheria (DJ Set)', role: 'Electronic Producer & DJ', company: 'SonicRecords', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kai Zen', role: 'Audio-Visual Artist', company: 'Prism Collective', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '06:00 PM', title: 'Gates Open & Ambient Warmup', desc: 'Explore art installations and sound gardens.' },
      { time: '08:00 PM', title: 'SynthWave Live Odyssey', desc: 'Retro 80s analog synthesizers paired with live drum kit.' },
      { time: '11:00 PM', title: 'Headliner: Holographic Finale', desc: 'Spatial surround sound with 3D projection mapping.' }
    ]
  },
  {
    id: 'kx-biz-03',
    title: 'Global Founders Pitch & Hackathon 2026',
    category: 'business',
    categoryLabel: 'Business & Startups',
    date: getFutureDate(11, 10, 0),
    time: '10:00 AM - 07:00 PM',
    venue: 'Venture Heights Center, Innovation Park',
    city: 'New Delhi / Online',
    locationType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'Pitch your breakthrough startup idea to top tier VCs and angel investors with ₹20 Lakhs in seed grants.',
    fullDesc: 'A fast-paced demo day where early-stage founders pitch to renowned angel networks and VC partners. Includes speed mentoring rounds, pitch deck workshops, and an evening investor networking banquet.',
    featured: false,
    price: 'Free',
    totalSeats: 120,
    registeredCount: 95,
    tags: ['Startups', 'Venture Capital', 'Pitching', 'Networking'],
    speakers: [
      { name: 'Ananya Sharma', role: 'Managing Partner', company: 'Peak Venture Capital', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
      { name: 'Marcus Sterling', role: 'Serial Tech Entrepreneur', company: 'FounderMatrix', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '10:00 AM', title: 'Opening Remarks & Keynote: Navigating Seed Rounds', desc: 'What tier-1 venture funds look for in 2026.' },
      { time: '01:00 PM', title: 'Cohort 1: 15 Curated Seed Pitches', desc: '5-minute pitch followed by 3-minute Q&A per team.' },
      { time: '05:00 PM', title: 'Grant Awards & Networking Soiree', desc: 'Winner announcements and open investor mixer.' }
    ]
  },
  {
    id: 'kx-work-04',
    title: 'Modern UI/UX Design System Masterclass',
    category: 'workshop',
    categoryLabel: 'Workshops',
    date: getFutureDate(5, 14, 0),
    time: '02:00 PM - 06:30 PM',
    venue: 'Design Hub Studio, Creative Quarter',
    city: 'Bangalore',
    locationType: 'In-Person',
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932dede?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'Hands-on intensive workshop mastering Figma tokens, variable modes, micro-interactions, and design-to-code pipelines.',
    fullDesc: 'Level up your interface craft with an award-winning product designer. Learn how to architect enterprise design systems, manage color and typography tokens, craft micro-interactions with smooth ease curves, and deliver flawless handoffs to engineering teams.',
    featured: false,
    price: '₹499',
    totalSeats: 60,
    registeredCount: 48,
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Design Tokens'],
    speakers: [
      { name: 'Kavita Sundaram', role: 'Principal Designer', company: 'DesignCraft Studio', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '02:00 PM', title: 'Design Token Architecture', desc: 'Primitives, semantic tokens, and component-level tokens in Figma.' },
      { time: '03:45 PM', title: 'Fluid Micro-Interactions & Prototyping', desc: 'Advanced prototyping, smart animates, and interactive components.' },
      { time: '05:15 PM', title: 'Design-to-Code Sync Workshop', desc: 'Bridging Figma with CSS Variables and Tailwind configuration.' }
    ]
  },
  {
    id: 'kx-game-05',
    title: 'Apex Champions: Valorant & CS2 Arena Cup',
    category: 'gaming',
    categoryLabel: 'Gaming & Esports',
    date: getFutureDate(9, 11, 0),
    time: '11:00 AM - 08:00 PM',
    venue: 'GamerVerse LAN Stadium, Sector 18',
    city: 'Hyderabad',
    locationType: 'In-Person',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'High-adrenaline competitive collegiate esports showdown with 64 teams battling for glory, trophies, and gaming gear.',
    fullDesc: 'Get ready for intense 5v5 tactical shooter action on 240Hz tournament rigs. Includes live shoutcasting, custom spectator screens, meet-and-greets with pro streamers, and a cosplay competition.',
    featured: true,
    price: '₹199',
    totalSeats: 200,
    registeredCount: 178,
    tags: ['Esports', 'Gaming', 'Valorant', 'LAN Tournament'],
    speakers: [
      { name: 'Rohan "Ranger" Mehra', role: 'Pro Caster & Analyst', company: 'Esports India', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '11:00 AM', title: 'Quarter-Final Matchups', desc: 'Best of 1 double-elimination brackets across 8 stations.' },
      { time: '03:30 PM', title: 'Semi-Finals Broadcast', desc: 'Main stage live-streamed with shoutcasters on Twitch & YouTube.' },
      { time: '06:00 PM', title: 'Grand Finals & Trophy Ceremony', desc: 'Best of 3 showdown and hardware giveaway.' }
    ]
  },
  {
    id: 'kx-sport-06',
    title: 'Sunset Marathon & Mindful Yoga Retreat',
    category: 'sports',
    categoryLabel: 'Sports & Fitness',
    date: getFutureDate(14, 6, 0),
    time: '06:00 AM - 11:30 AM',
    venue: 'Green Valley Lake Promenade',
    city: 'Pune',
    locationType: 'In-Person',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    shortDesc: 'A rejuvenating 5K/10K lakeside run followed by guided sound-bowl meditation, breathwork, and healthy organic brunch.',
    fullDesc: 'Kickstart your wellness journey surrounded by scenic nature. The morning begins with a timed 5K & 10K eco-run, transitioning into an invigorating outdoor Vinyasa yoga session led by certified international practitioners. All participants receive an eco-cotton running jersey and finisher medal.',
    featured: false,
    price: '₹349',
    totalSeats: 180,
    registeredCount: 142,
    tags: ['Marathon', 'Yoga', 'Wellness', 'Fitness'],
    speakers: [
      { name: 'Tara Deshmukh', role: 'Certified Yoga Acharya', company: 'Prana Flow', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    schedule: [
      { time: '06:00 AM', title: 'Warm-up & 10K/5K Flag-off', desc: 'Timed chip race along scenic lakeside promenade.' },
      { time: '08:30 AM', title: 'Sound-Bath Yoga & Guided Pranayama', desc: 'Rejuvenate body and mind under morning sun.' },
      { time: '10:00 AM', title: 'Organic Smoothie Bar & Finisher Medals', desc: 'Nutritional breakfast and awards ceremony.' }
    ]
  }
];
