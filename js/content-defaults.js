/* Built-in website content. Used when nothing has been saved from /edit yet,
   or when the database can't be reached. The admin editor starts from this too. */
window.SITE_DEFAULTS = (() => {
  const texts = {
    heroEyebrow: 'Bags for every journey · Since 1989',
    heroTitle1: 'Bags for every journey.',
    heroTitle2: 'Built for every need.',
    heroLead: 'Suyog Enterprises has been manufacturing and supplying bags since 1989. School, college, travel, office, laptop, gym and lifestyle bags, with corporate gifting, custom bags, private labeling and bulk orders across India.',
    aboutText: 'Suyog Enterprises is a manufacturer and supplier of bags, trusted since 1989. From school backpacks and college bags to trolley sets, leather office bags and laptop bags, we supply retail buyers, schools, institutions and companies, with custom branding, private labeling and pan India delivery for bulk orders.',
    tagline: 'Bags for every journey, since 1989.',
    servicesIntro: 'Corporate solutions and bag supply for schools, businesses and retailers.',
    productsIntro: 'Our product range. Tap a bag for a closer look, then enquire on WhatsApp for price and stock.',
    footerTagline: 'Premium quality. Durable. Custom made. Wide range.',
    locationTitle: 'Pune',
    locationAddress: 'FV5H+C6P, Kondhwa Budruk, Pune, Maharashtra 411048'
  };

  const services = [
  {
    "t": "Corporate Gifting",
    "d": "Branded bags for clients, teams and events, packed and delivered on time.",
    "img": "assets/services/s0.jpg"
  },
  {
    "t": "Institutions & Schools",
    "d": "School, college and uniform bags supplied in bulk to institutions.",
    "img": "assets/services/s1.jpg"
  },
  {
    "t": "Customized Bags",
    "d": "Your colours, your logo and your design, made to order.",
    "img": "assets/services/s2.jpg"
  },
  {
    "t": "Private Labeling",
    "d": "Our quality bags under your brand name, made to your specification.",
    "img": "assets/services/s3.jpg"
  },
  {
    "t": "Bulk Orders & Pan India Delivery",
    "d": "Wholesale quantities supplied and delivered across India.",
    "img": "assets/services/s4.jpg"
  },
  {
    "t": "School & College Bags",
    "d": "Durable, comfortable backpacks for every age and every class.",
    "img": "assets/services/s5.jpg"
  },
  {
    "t": "Travel & Luggage",
    "d": "Trolleys, duffels and travel sets for every journey.",
    "img": "assets/services/s6.jpg"
  },
  {
    "t": "Office & Laptop Bags",
    "d": "Leather office bags, briefcases and laptop bags for work.",
    "img": "assets/services/s7.jpg"
  }
];

  // cat: S School, C College, T Travel, O Office, L Laptop, G Gym & Sports, Y Lifestyle. price 0 = ask for price
  const products = [
    {"name": "Trolley Set of 3", "cat": "T", "note": "Sage green · Hard shell", "price": 0, "img": "assets/products/p044.jpg", "detail": "assets/catalogue/c044.jpg"},
    {"name": "Spider-Man School Bag", "cat": "S", "note": "Red · Kids backpack", "price": 0, "img": "assets/products/p000.jpg", "detail": "assets/catalogue/c000.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Brown · Multi-pocket", "price": 0, "img": "assets/products/p077.jpg", "detail": "assets/catalogue/c077.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black & orange", "price": 0, "img": "assets/products/p022.jpg", "detail": "assets/catalogue/c022.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Tan", "price": 0, "img": "assets/products/p091.jpg", "detail": "assets/catalogue/c091.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Navy · Hard shell", "price": 0, "img": "assets/products/p045.jpg", "detail": "assets/catalogue/c045.jpg"},
    {"name": "Barbie School Bag", "cat": "S", "note": "Pink · Kids backpack", "price": 0, "img": "assets/products/p001.jpg", "detail": "assets/catalogue/c001.jpg"},
    {"name": "Leather Sling Bag", "cat": "Y", "note": "Brown", "price": 0, "img": "assets/products/p106.jpg", "detail": "assets/catalogue/c106.jpg"},
    {"name": "Unicorn School Bag", "cat": "S", "note": "Lilac · Kids backpack", "price": 0, "img": "assets/products/p002.jpg", "detail": "assets/catalogue/c002.jpg"},
    {"name": "Spider-Man School Bag", "cat": "S", "note": "Grey & red", "price": 0, "img": "assets/products/p003.jpg", "detail": "assets/catalogue/c003.jpg"},
    {"name": "Snow White School Bag", "cat": "S", "note": "Disney Princess", "price": 0, "img": "assets/products/p004.jpg", "detail": "assets/catalogue/c004.jpg"},
    {"name": "Barbie High School Bag", "cat": "S", "note": "Pastel pink", "price": 0, "img": "assets/products/p005.jpg", "detail": "assets/catalogue/c005.jpg"},
    {"name": "Unicorn School Bag", "cat": "S", "note": "Teal & pink", "price": 0, "img": "assets/products/p006.jpg", "detail": "assets/catalogue/c006.jpg"},
    {"name": "Spider-Man School Bag", "cat": "S", "note": "Red & navy", "price": 0, "img": "assets/products/p007.jpg", "detail": "assets/catalogue/c007.jpg"},
    {"name": "Princess School Bag", "cat": "S", "note": "Pink · Kids backpack", "price": 0, "img": "assets/products/p008.jpg", "detail": "assets/catalogue/c008.jpg"},
    {"name": "Spider-Man School Bag", "cat": "S", "note": "Red · 3D print", "price": 0, "img": "assets/products/p009.jpg", "detail": "assets/catalogue/c009.jpg"},
    {"name": "Unicorn School Bag", "cat": "S", "note": "Pink · Holographic", "price": 0, "img": "assets/products/p010.jpg", "detail": "assets/catalogue/c010.jpg"},
    {"name": "Barbie School Bag", "cat": "S", "note": "Pink & teal", "price": 0, "img": "assets/products/p011.jpg", "detail": "assets/catalogue/c011.jpg"},
    {"name": "Spider-Man School Bag", "cat": "S", "note": "Navy", "price": 0, "img": "assets/products/p012.jpg", "detail": "assets/catalogue/c012.jpg"},
    {"name": "Unicorn Print School Bag", "cat": "S", "note": "Navy", "price": 0, "img": "assets/products/p013.jpg", "detail": "assets/catalogue/c013.jpg"},
    {"name": "Barbie School Bag", "cat": "S", "note": "Blue & pink", "price": 0, "img": "assets/products/p014.jpg", "detail": "assets/catalogue/c014.jpg"},
    {"name": "Unicorn School Bag", "cat": "S", "note": "Mint & lilac", "price": 0, "img": "assets/products/p015.jpg", "detail": "assets/catalogue/c015.jpg"},
    {"name": "Spider-Man Junior Bag", "cat": "S", "note": "Blue & red", "price": 0, "img": "assets/products/p016.jpg", "detail": "assets/catalogue/c016.jpg"},
    {"name": "Barbie School Bag", "cat": "S", "note": "Pink", "price": 0, "img": "assets/products/p017.jpg", "detail": "assets/catalogue/c017.jpg"},
    {"name": "Barbie School Bag", "cat": "S", "note": "Pastel", "price": 0, "img": "assets/products/p018.jpg", "detail": "assets/catalogue/c018.jpg"},
    {"name": "Unicorn Kids Bag", "cat": "S", "note": "Pink · Pre-school", "price": 0, "img": "assets/products/p019.jpg", "detail": "assets/catalogue/c019.jpg"},
    {"name": "Spider-Man Kids Bag", "cat": "S", "note": "Pre-school", "price": 0, "img": "assets/products/p020.jpg", "detail": "assets/catalogue/c020.jpg"},
    {"name": "Plush Unicorn Bag", "cat": "S", "note": "White · Pre-school", "price": 0, "img": "assets/products/p021.jpg", "detail": "assets/catalogue/c021.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Blue", "price": 0, "img": "assets/products/p023.jpg", "detail": "assets/catalogue/c023.jpg"},
    {"name": "Graphic College Backpack", "cat": "C", "note": "Grey · Tiger print", "price": 0, "img": "assets/products/p024.jpg", "detail": "assets/catalogue/c024.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Red & yellow", "price": 0, "img": "assets/products/p025.jpg", "detail": "assets/catalogue/c025.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Tan", "price": 0, "img": "assets/products/p026.jpg", "detail": "assets/catalogue/c026.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black · Camo panel", "price": 0, "img": "assets/products/p027.jpg", "detail": "assets/catalogue/c027.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Grey & orange", "price": 0, "img": "assets/products/p028.jpg", "detail": "assets/catalogue/c028.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Teal blue", "price": 0, "img": "assets/products/p029.jpg", "detail": "assets/catalogue/c029.jpg"},
    {"name": "Printed College Backpack", "cat": "C", "note": "Mountain print", "price": 0, "img": "assets/products/p030.jpg", "detail": "assets/catalogue/c030.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Navy", "price": 0, "img": "assets/products/p031.jpg", "detail": "assets/catalogue/c031.jpg"},
    {"name": "Printed College Backpack", "cat": "C", "note": "Grey & yellow", "price": 0, "img": "assets/products/p032.jpg", "detail": "assets/catalogue/c032.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Grey · Printed", "price": 0, "img": "assets/products/p033.jpg", "detail": "assets/catalogue/c033.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Light grey", "price": 0, "img": "assets/products/p034.jpg", "detail": "assets/catalogue/c034.jpg"},
    {"name": "Daypack", "cat": "C", "note": "Red", "price": 0, "img": "assets/products/p035.jpg", "detail": "assets/catalogue/c035.jpg"},
    {"name": "Daypack", "cat": "C", "note": "Black & orange", "price": 0, "img": "assets/products/p036.jpg", "detail": "assets/catalogue/c036.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black & red", "price": 0, "img": "assets/products/p037.jpg", "detail": "assets/catalogue/c037.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black", "price": 0, "img": "assets/products/p038.jpg", "detail": "assets/catalogue/c038.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black", "price": 0, "img": "assets/products/p039.jpg", "detail": "assets/catalogue/c039.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black & grey", "price": 0, "img": "assets/products/p040.jpg", "detail": "assets/catalogue/c040.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black · Textured", "price": 0, "img": "assets/products/p041.jpg", "detail": "assets/catalogue/c041.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black · Printed", "price": 0, "img": "assets/products/p042.jpg", "detail": "assets/catalogue/c042.jpg"},
    {"name": "College Backpack", "cat": "C", "note": "Black", "price": 0, "img": "assets/products/p043.jpg", "detail": "assets/catalogue/c043.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Champagne · Hard shell", "price": 0, "img": "assets/products/p046.jpg", "detail": "assets/catalogue/c046.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Yellow · Hard shell", "price": 0, "img": "assets/products/p047.jpg", "detail": "assets/catalogue/c047.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Lilac · Hard shell", "price": 0, "img": "assets/products/p048.jpg", "detail": "assets/catalogue/c048.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Teal · Hard shell", "price": 0, "img": "assets/products/p049.jpg", "detail": "assets/catalogue/c049.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Red · Hard shell", "price": 0, "img": "assets/products/p050.jpg", "detail": "assets/catalogue/c050.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Black · Hard shell", "price": 0, "img": "assets/products/p051.jpg", "detail": "assets/catalogue/c051.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Aqua · Hard shell", "price": 0, "img": "assets/products/p052.jpg", "detail": "assets/catalogue/c052.jpg"},
    {"name": "Soft Trolley Set of 3", "cat": "T", "note": "Brown · Fabric", "price": 0, "img": "assets/products/p053.jpg", "detail": "assets/catalogue/c053.jpg"},
    {"name": "Trolley Set with Backpack", "cat": "T", "note": "Blue", "price": 0, "img": "assets/products/p054.jpg", "detail": "assets/catalogue/c054.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Olive · Hard shell", "price": 0, "img": "assets/products/p055.jpg", "detail": "assets/catalogue/c055.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Teal blue", "price": 0, "img": "assets/products/p056.jpg", "detail": "assets/catalogue/c056.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Maroon", "price": 0, "img": "assets/products/p057.jpg", "detail": "assets/catalogue/c057.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Turquoise", "price": 0, "img": "assets/products/p058.jpg", "detail": "assets/catalogue/c058.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Sky blue", "price": 0, "img": "assets/products/p059.jpg", "detail": "assets/catalogue/c059.jpg"},
    {"name": "Soft Trolley Set of 3", "cat": "T", "note": "Red · Fabric", "price": 0, "img": "assets/products/p060.jpg", "detail": "assets/catalogue/c060.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "White", "price": 0, "img": "assets/products/p061.jpg", "detail": "assets/catalogue/c061.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Powder blue", "price": 0, "img": "assets/products/p062.jpg", "detail": "assets/catalogue/c062.jpg"},
    {"name": "Printed Trolley Set of 3", "cat": "T", "note": "Graphic print", "price": 0, "img": "assets/products/p063.jpg", "detail": "assets/catalogue/c063.jpg"},
    {"name": "Trolley Set with Pouches", "cat": "T", "note": "Red", "price": 0, "img": "assets/products/p064.jpg", "detail": "assets/catalogue/c064.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Black · Textured", "price": 0, "img": "assets/products/p065.jpg", "detail": "assets/catalogue/c065.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Grey · Diamond pattern", "price": 0, "img": "assets/products/p066.jpg", "detail": "assets/catalogue/c066.jpg"},
    {"name": "Cabin Trolley", "cat": "T", "note": "Black · Diamond pattern", "price": 0, "img": "assets/products/p067.jpg", "detail": "assets/catalogue/c067.jpg"},
    {"name": "Trolley Set of 2", "cat": "T", "note": "Charcoal", "price": 0, "img": "assets/products/p068.jpg", "detail": "assets/catalogue/c068.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Black · Ribbed", "price": 0, "img": "assets/products/p069.jpg", "detail": "assets/catalogue/c069.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Gunmetal", "price": 0, "img": "assets/products/p070.jpg", "detail": "assets/catalogue/c070.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Navy · Ribbed", "price": 0, "img": "assets/products/p071.jpg", "detail": "assets/catalogue/c071.jpg"},
    {"name": "Soft Trolley Set of 3", "cat": "T", "note": "Black & blue", "price": 0, "img": "assets/products/p072.jpg", "detail": "assets/catalogue/c072.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Slate grey", "price": 0, "img": "assets/products/p073.jpg", "detail": "assets/catalogue/c073.jpg"},
    {"name": "Trolley Set of 2", "cat": "T", "note": "Black · Spinner wheels", "price": 0, "img": "assets/products/p074.jpg", "detail": "assets/catalogue/c074.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Grey · Ribbed", "price": 0, "img": "assets/products/p075.jpg", "detail": "assets/catalogue/c075.jpg"},
    {"name": "Trolley Set of 3", "cat": "T", "note": "Red", "price": 0, "img": "assets/products/p076.jpg", "detail": "assets/catalogue/c076.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Tan · Multi-pocket", "price": 0, "img": "assets/products/p078.jpg", "detail": "assets/catalogue/c078.jpg"},
    {"name": "Leather Briefcase", "cat": "O", "note": "Maroon", "price": 0, "img": "assets/products/p079.jpg", "detail": "assets/catalogue/c079.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Brown · Expandable", "price": 0, "img": "assets/products/p080.jpg", "detail": "assets/catalogue/c080.jpg"},
    {"name": "Leather Briefcase", "cat": "O", "note": "Brown", "price": 0, "img": "assets/products/p081.jpg", "detail": "assets/catalogue/c081.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Black · Multi-pocket", "price": 0, "img": "assets/products/p082.jpg", "detail": "assets/catalogue/c082.jpg"},
    {"name": "Leather Messenger Bag", "cat": "O", "note": "Tan", "price": 0, "img": "assets/products/p083.jpg", "detail": "assets/catalogue/c083.jpg"},
    {"name": "Leather Messenger Bag", "cat": "O", "note": "Dark brown", "price": 0, "img": "assets/products/p084.jpg", "detail": "assets/catalogue/c084.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Dark brown", "price": 0, "img": "assets/products/p085.jpg", "detail": "assets/catalogue/c085.jpg"},
    {"name": "Leather Office Bag", "cat": "O", "note": "Brown", "price": 0, "img": "assets/products/p086.jpg", "detail": "assets/catalogue/c086.jpg"},
    {"name": "Office Bag", "cat": "O", "note": "Black", "price": 0, "img": "assets/products/p087.jpg", "detail": "assets/catalogue/c087.jpg"},
    {"name": "Leather Briefcase", "cat": "O", "note": "Maroon · Slim", "price": 0, "img": "assets/products/p088.jpg", "detail": "assets/catalogue/c088.jpg"},
    {"name": "Leather Work Tote", "cat": "O", "note": "Brown", "price": 0, "img": "assets/products/p089.jpg", "detail": "assets/catalogue/c089.jpg"},
    {"name": "Leather Duffel Briefcase", "cat": "O", "note": "Tan", "price": 0, "img": "assets/products/p090.jpg", "detail": "assets/catalogue/c090.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Wine", "price": 0, "img": "assets/products/p092.jpg", "detail": "assets/catalogue/c092.jpg"},
    {"name": "Slim Laptop Bag", "cat": "L", "note": "Black", "price": 0, "img": "assets/products/p093.jpg", "detail": "assets/catalogue/c093.jpg"},
    {"name": "Laptop Bag", "cat": "L", "note": "Navy", "price": 0, "img": "assets/products/p094.jpg", "detail": "assets/catalogue/c094.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Brown", "price": 0, "img": "assets/products/p095.jpg", "detail": "assets/catalogue/c095.jpg"},
    {"name": "Laptop Tote", "cat": "L", "note": "Tan", "price": 0, "img": "assets/products/p096.jpg", "detail": "assets/catalogue/c096.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Dark brown", "price": 0, "img": "assets/products/p097.jpg", "detail": "assets/catalogue/c097.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Plum", "price": 0, "img": "assets/products/p098.jpg", "detail": "assets/catalogue/c098.jpg"},
    {"name": "Laptop Bag", "cat": "L", "note": "Navy · Zip top", "price": 0, "img": "assets/products/p099.jpg", "detail": "assets/catalogue/c099.jpg"},
    {"name": "Laptop Bag", "cat": "L", "note": "Black", "price": 0, "img": "assets/products/p100.jpg", "detail": "assets/catalogue/c100.jpg"},
    {"name": "Croc-texture Laptop Bag", "cat": "L", "note": "Cognac", "price": 0, "img": "assets/products/p101.jpg", "detail": "assets/catalogue/c101.jpg"},
    {"name": "Laptop Backpack", "cat": "L", "note": "Black · Reflective", "price": 0, "img": "assets/products/p102.jpg", "detail": "assets/catalogue/c102.jpg"},
    {"name": "Laptop Backpack", "cat": "L", "note": "Black · Slim", "price": 0, "img": "assets/products/p103.jpg", "detail": "assets/catalogue/c103.jpg"},
    {"name": "Wheeled Duffel Bag", "cat": "G", "note": "Purple", "price": 0, "img": "assets/products/p104.jpg", "detail": "assets/catalogue/c104.jpg"},
    {"name": "Trekking Rucksack", "cat": "G", "note": "Navy", "price": 0, "img": "assets/products/p105.jpg", "detail": "assets/catalogue/c105.jpg"},
    {"name": "Chest Sling Bag", "cat": "Y", "note": "Grey", "price": 0, "img": "assets/products/p107.jpg", "detail": "assets/catalogue/c107.jpg"},
    {"name": "Mini Sling Bag", "cat": "Y", "note": "Black", "price": 0, "img": "assets/products/p108.jpg", "detail": "assets/catalogue/c108.jpg"},
    {"name": "Waist Pouch", "cat": "Y", "note": "Black", "price": 0, "img": "assets/products/p109.jpg", "detail": "assets/catalogue/c109.jpg"},
    {"name": "Waist Pouch", "cat": "Y", "note": "Black · Multi-zip", "price": 0, "img": "assets/products/p110.jpg", "detail": "assets/catalogue/c110.jpg"},
    {"name": "Waist Pouch", "cat": "Y", "note": "Black", "price": 0, "img": "assets/products/p111.jpg", "detail": "assets/catalogue/c111.jpg"},
    {"name": "Travel Money Belt", "cat": "Y", "note": "Black & beige", "price": 0, "img": "assets/products/p112.jpg", "detail": "assets/catalogue/c112.jpg"}
  ];

  const gallery = [
  {
    "thumb": "assets/gallery/thumb/poster.jpg",
    "full": "assets/gallery/full/poster.jpg",
    "alt": "Suyog Enterprises bag collection poster",
    "fit": "contain",
    "bg": "#F3EADB"
  },
  {
    "thumb": "assets/gallery/thumb/g01.jpg",
    "full": "assets/gallery/full/g01.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g02.jpg",
    "full": "assets/gallery/full/g02.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g03.jpg",
    "full": "assets/gallery/full/g03.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g04.jpg",
    "full": "assets/gallery/full/g04.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g05.jpg",
    "full": "assets/gallery/full/g05.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g06.jpg",
    "full": "assets/gallery/full/g06.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g07.jpg",
    "full": "assets/gallery/full/g07.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g08.jpg",
    "full": "assets/gallery/full/g08.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g09.jpg",
    "full": "assets/gallery/full/g09.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g10.jpg",
    "full": "assets/gallery/full/g10.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g11.jpg",
    "full": "assets/gallery/full/g11.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g12.jpg",
    "full": "assets/gallery/full/g12.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g13.jpg",
    "full": "assets/gallery/full/g13.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g14.jpg",
    "full": "assets/gallery/full/g14.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g15.jpg",
    "full": "assets/gallery/full/g15.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g16.jpg",
    "full": "assets/gallery/full/g16.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g17.jpg",
    "full": "assets/gallery/full/g17.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g18.jpg",
    "full": "assets/gallery/full/g18.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  },
  {
    "thumb": "assets/gallery/thumb/g19.jpg",
    "full": "assets/gallery/full/g19.jpg",
    "alt": "Bag from Suyog Enterprises",
    "fit": "cover",
    "bg": ""
  }
];

  // bag categories, in the order the filter buttons show
  const categories = [
    { id: 'S', name: 'School' }, { id: 'C', name: 'College' }, { id: 'T', name: 'Travel' }, { id: 'O', name: 'Office' },
    { id: 'L', name: 'Laptop' }, { id: 'G', name: 'Gym & Sports' }, { id: 'Y', name: 'Lifestyle' }
  ];

  // placeholder reviews: replace with real customer reviews from /edit
  const testimonials = [
    { n: 'Prathmesh', r: 5, q: 'Ordered school bags in bulk for our institute. Strong stitching, good finish and delivered on time.' },
    { n: 'Shail', r: 5, q: 'Great quality trolley set for the price. The team helped us choose over WhatsApp and it arrived quickly.' },
    { n: 'Akshata', r: 5, q: 'We gave their leather laptop bags as corporate gifts with our logo. Everyone loved them.' }
  ];

  // opening hours, index 0 = Sunday ... 6 = Saturday (24-hour "HH:MM")
  const day = (open, close) => ({ closed: false, open, close });
  const hours = [{ closed: true, open: '09:00', close: '17:00' }, day('09:00', '17:00'), day('09:00', '17:00'), day('09:00', '17:00'),
    day('09:00', '17:00'), day('09:00', '17:00'), { closed: true, open: '09:00', close: '17:00' }];

  // numbers with country code, digits only
  const contact = { whatsapp: '919371814999', phone: '919371814999', email: 'suyogenterprises1989@gmail.com' };

  return { texts, services, products, gallery, categories, testimonials, hours, contact };
})();
