export interface VideoMeme {
  id: string;
  title: string;
  videoUrl: string;
  tags: string[];
  likes: number;
  shares: number;
  views: number;
  downloads: number;
  movieName: string;
  creator: string;
  originalIndex?: number;
}

// ==========================================
// PRODUCTION CLOUDFLARE R2 CONFIGURATION
// ==========================================
// 1. Set USE_R2 to true once you upload the videos to your R2 bucket.
// 2. Put your public R2 bucket domain or custom subdomain in R2_BUCKET_BASE_URL.
export const USE_R2 = true; 
export const R2_BUCKET_BASE_URL = "https://pub-fed721a1f3e744b88927e20d43934fae.r2.dev/downloaded_videos";

const gdriveFiles = [
  { id: "1bHHhFOirD-7aOM1wJOg1JWpRxafuTiYk", name: "VID_20260701_022913_990.mp4" },
  { id: "1WkQYX_5K5Tfrx9Tt5QvG7Irwk6VqI8iN", name: "VID_20260701_022918_020.mp4" },
  { id: "18fyXT3bJxwQXiljpy_li86xKE5eiQuSj", name: "VID_20260701_022924_610.mp4" },
  { id: "1dek8GC0enzl9lzYm08ynGQHHmCNrbrvl", name: "VID_20260701_022933_078.mp4" },
  { id: "1HRgH3ro17cNRmu-EnWj59TLEz-2hbUx4", name: "VID_20260701_022937_657.mp4" },
  { id: "1p0DZt5vhvISMb16xMgzDR9z7y97GAx6H", name: "VID_20260701_022946_802.mp4" },
  { id: "1PddsvPpH265HosTiGaS9PgPkv5I44uCT", name: "VID_20260701_022950_055.mp4" },
  { id: "1SDv8pLy8XYoIzsjLkOqf4GaN1gu9NnNx", name: "VID_20260701_022956_078.mp4" },
  { id: "1gOkDIluuiCRqgWd_e5I870TJbfkOMfru", name: "VID_20260701_023011_052.mp4" },
  { id: "1RaXjYKiVn6I5tTck15NOnwMJbWWAqiPd", name: "VID_20260701_023015_941.mp4" },
  { id: "19wIaEj3YrD2pRBVEusNuOePAWkOikuij", name: "VID_20260701_023020_221.mp4" },
  { id: "14S_uzvcaHZtSlGL6dXPcWlO7o4KS4nQ6", name: "VID_20260701_023029_730.mp4" },
  { id: "1PORXkyzRSovgAihbR4QWkeEzWhRbMXXs", name: "VID_20260701_023045_101.mp4" },
  { id: "1nDDAcIvhKH8D_aQr79PT8XrL0zDLqWQH", name: "VID_20260701_023052_956.mp4" },
  { id: "1zegnVoJi_w7u8B4askHsK_DQ6G0CUjvK", name: "VID_20260701_023056_391.mp4" },
  { id: "1L-_WhDFD29Vb7L9srtkifrD-jQ5GmNVO", name: "VID-20251125-WA0019(3).mp4" },
  { id: "1drk6skrWVeLHo8VbcfgACt-CqDJQO_fV", name: "VID-20251225-WA0108.mp4" },
  { id: "1PJBeIWfPur4NIgHet-OeMjikjV-KJboE", name: "VID-20260119-WA0001.mp4" },
  { id: "1I_vEGZwL1Q-u71wpfQvO6YgBEjmWZ9cV", name: "VID-20260122-WA0023.mp4" },
  { id: "1w0yifdEJ1ZpaS4cDcIwq0EgulfNcdzo-", name: "VID-20260206-WA0008(1).mp4" },
  { id: "1YnBE05PxaeF6BCtk-xNtsMZP7ZaxHA7I", name: "VID-20260228-WA0030.mp4" },
  { id: "1V7WnQNtULxoY9XNWtFhL4K_HeAcwMbOX", name: "VID-20260305-WA0018.mp4" },
  { id: "1zosN0Nb_Np3QqWRjRkXs6mk7S60foYBt", name: "VID-20260305-WA0024.mp4" },
  { id: "1sY3QgTpxaSgaU3jrB89vg0wKXeYdTDR8", name: "VID-20260310-WA0003.mp4" },
  { id: "19_AY8XpfoaGELD2wlaRFKclsiAF_KYpH", name: "VID-20260314-WA0015.mp4" },
  { id: "1C0pxZsGiP882dUmc1Bz58v-JUwOad_ZG", name: "VID-20260314-WA0021(1).mp4" },
  { id: "1w2_qbZtS3I12xWTgk7GOnh7P40sQ6D4W", name: "VID-20260314-WA0034.mp4" },
  { id: "1BVdL_qKf5ZtfOD4dCxm7leqDKyTkOQ8v", name: "VID-20260315-WA0025(1).mp4" },
  { id: "1UiZxsGVqITa_JmFP-pe52K6DWUuXqnIQ", name: "VID-20260315-WA0026.mp4" },
  { id: "1jJeVwgvCajoibOjBbBtYnwkRFpwL4sae", name: "VID-20260320-WA0004.mp4" },
  { id: "15zFSExVpzdrbD2_Pu5w83GXcVEjmth7-", name: "VID-20260326-WA0024.mp4" },
  { id: "1Ev5GXPj51hJWNqVkdiRWJ-p6_jEt08e5", name: "VID-20260329-WA0033.mp4" },
  { id: "1G2X9sv_fW2BZKR8nr_CrFZzZr9HyLF5Q", name: "VID-20260410-WA0028.mp4" },
  { id: "1DNQSzVoNtAAYykzfA2mTyW_qUIyFlDjr", name: "VID-20260503-WA0020(2).mp4" },
  { id: "1zQ-owhx03dxUvXRz32_kkfSWZc1z6hUL", name: "VID-20260513-WA0034(1).mp4" },
  { id: "16e42zIKv6nt-lTZvh5dL9QHdFRip6jyy", name: "VID-20260513-WA0045.mp4" },
  { id: "1zYYM0EPZCQ5hwoPK1yiyUV_GNnzR38ly", name: "VID-20260513-WA0050.mp4" },
  { id: "1cPbS-bSuJoAzNPfVOhp7tsEc3tp4VoaX", name: "VID-20260514-WA0006.mp4" },
  { id: "1N3XCEqjNTeaYrC_djlWklrR-Lk79m87K", name: "VID-20260520-WA0005(1).mp4" },
  { id: "1G-FHalJ5ErkFpYiQGB3IO4jHsJ6gUiqA", name: "VID-20260521-WA0101.mp4" },
  { id: "1yQUbU8tccS92i8KO1cliHsPP5wWqbr9d", name: "VID-20260522-WA0064.mp4" },
  { id: "1GH9TKF5iTrSjewrsP7KAu2xeoFPQBy2l", name: "VID-20260601-WA0036(1).mp4" },
  { id: "1a0ygMh_RHIDEwF32tdZyPl_820XXyoib", name: "VID-20260604-WA0042(1).mp4" },
  { id: "1FYuOdvkFl_w-0_BRX_-AVLykqDlp2gdf", name: "VID-20260606-WA0057.mp4" },
  { id: "1ti4QqDUZBC2q8dJG8le3WmJQfLKCiMU5", name: "VID-20260606-WA0070(1).mp4" },
  { id: "1lQc6ZkOr7WSj4zAOMa3135cFpUyh8eRZ", name: "VID-20260613-WA0036.mp4" },
  { id: "1ujWO7W56DPXa1Sn_7WVeDx20t5gdDiCC", name: "VID-20260614-WA0029.mp4" },
  { id: "1iIHKdmzthCmf1epj-ukJBXmWZunmdo8n", name: "VID-20260615-WA0034.mp4" },
  { id: "1Kt-YlQcfiBzpFce5gSMnhEF1uGN7tHSZ", name: "VID-20260616-WA0012(1).mp4" },
  { id: "11ZQD4jsn4kh3gTQPzf1uubOWRi2MgPm-", name: "VID-20260617-WA0045.mp4" },
  { id: "1q4QzICx1lU3oCMkrhNTMTHQuqDSATrqA", name: "VID-20260620-WA0010.mp4" },
  { id: "12TCR9ORL2AItXXseJ5Gengktfe0LMHt2", name: "VID-20260625-WA0040.mp4" },
  { id: "14MGj4JbgtzK9aK80a5y1CYqmM5ezJmPL", name: "YouCut_20260701_152539386.mp4" },
  { id: "1M3rCl324Ak335uXJOEGhmz9LXx346BD_", name: "YouCut_20260701_152741456.mp4" }
];

const memeMetadataList = [
  {
    title: "Namukku...",
    movieName: "Punjabi House",
    tags: [
      "punjabi house",
      "dileep",
      "harisreeashokan",
      "confused",
      "comedy"
    ],
    creator: "@amar_fans"
  },
  {
    title: "Ini neeyengaanum...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "dashamoolam",
      "salimkumar",
      "comedy"
    ],
    creator: "@madhavan_fan"
  },
  {
    title: "Undaakkalle, enikkitt undaakkalle!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "suresh gopi",
      "angry",
      "funny"
    ],
    creator: "@pyari_kalyanam"
  },
  {
    title: "Actor!",
    movieName: "Karikku",
    tags: [
      "george",
      "style",
      "classic"
    ],
    creator: "@madhavan_fan"
  },
  {
    title: "Bloody fool!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "dhyan",
      "angry",
      "funny"
    ],
    creator: "@peethambaran_si"
  },
  {
    title: "Enikku thaalparyam undaayittalla, pinne avarokke nirbandhikkumpol...",
    movieName: "King Lier",
    tags: [
      "dileep",
      "relatable",
      "funny"
    ],
    creator: "@pyari_kalyanam"
  },
  {
    title: "Nee enne thanne uddheshichaanu, enne thanne uddheshichaanu, enne maathram uddheshichaanu!",
    movieName: "CID MOSA",
    tags: [
      "suspicious",
      "classic"
    ],
    creator: "@pyari_kalyanam"
  },
  {
    title: "Athu sheri, ningalkkellavarkkum ellam ariyam...",
    movieName: "Bro daddy",
    tags: [
      "lalu alex",
      "shocked",
      "emotional"
    ],
    creator: "@pyari_kalyanam"
  },
  {
    title: "Njan oru prathibhaayaanu, prathibhaasamaanu!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "mass",
      "pride",
      "funny"
    ],
    creator: "@manavalan_boss"
  },
  {
    title: "Rathrii orupolla kanne adakade irrunu indakiyada",
    movieName: "Malayalam Movie Scene",
    tags: [],
    creator: "@abu_teased"
  },
  {
    title: "Ninneyokke vitta kaashu ente kayyilundu!",
    movieName: "King Lier",
    tags: [
      "harisreeashokan",
      "ramanan",
      "angry",
      "classic"
    ],
    creator: "@ramanan_mercy"
  },
  {
    title: "Athishayokthi, kevalam athishayokthi mathram!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "salimkumar",
      "mukundan",
      "court",
      "lawyer",
      "argument"
    ],
    creator: "@mukundan_arguments"
  },
  {
    title: "Ninakum vandeddaa...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "mammootty",
      "emotion"
    ],
    creator: "@manikyam_boat"
  },
  {
    title: "aa spot varee onnu poyalu...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "mammootty",
      "rajamanikyam",
      "mass",
      "expression",
      "dialogue"
    ],
    creator: "@manikyam_fans"
  },
  {
    title: "Aha, enikku mathramo? Ellarkkum vannallo sukham!",
    movieName: "Meesa Madhavan",
    tags: [
      "jagathy",
      "massage",
      "classic",
      "relax",
      "expression"
    ],
    creator: "@anveedu_classics"
  },
  {
    title: "Venda... nee chaya kudichaal...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "tea",
      "premam"
    ],
    creator: "@mukundan_memes"
  },
  {
    title: "Njan vishwasichu!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "dileep",
      "trust",
      "funny"
    ],
    creator: "@wedding_laughs"
  },
  {
    title: "Aayiram roopaykk...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "cash",
      "deal",
      "funny"
    ],
    creator: "@grandfather_looks"
  },
  {
    title: "Athaanu, oru pediyumilla...",
    movieName: "Driving Licence",
    tags: [
      "brave",
      "no-fear",
      "funny",
      "prithviraj"
    ],
    creator: "@sujith_ride"
  },
  {
    title: "Ithellaam oru entertainment",
    movieName: "AADU",
    tags: [
      "Dude",
      "aadu"
    ],
    creator: "@kuttan_vlogs"
  },
  {
    title: "Athippo laabhamayallo!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "profit",
      "happy",
      "funny"
    ],
    creator: "@grandfather_looks"
  },
  {
    title: "Nee...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "pointing",
      "accusing",
      "funny"
    ],
    creator: "@ grandfather_looks"
  },
  {
    title: "Avarkkillatha onnum namukkille bhai... buddhi!",
    movieName: "Runway",
    tags: [
      "dileep",
      "funny",
      "buddhi"
    ],
    creator: "@pandippada_fans"
  },
  {
    title: "Umesh, enthellaam... 42 supply",
    movieName: "Vadakan Selfie",
    tags: [
      "dhyansreenivasan",
      "kunjiramayanam",
      "jersey",
      "football",
      "funny"
    ],
    creator: "@kunjiraman_jersey"
  },
  {
    title: "Idaykkokkorkkum... Pinne karuthi aarelum thallikkonn kadalil thallikkaanum!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "mohanlal",
      "office",
      "comedy"
    ],
    creator: "@ramanan_office"
  },
  {
    title: "Njan oru praavashyam njettiyath... Enikku vattam...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "shocked",
      "crazy",
      "funny"
    ],
    creator: "@hariharnagar_gang"
  },
  {
    title: "Poda Panni....",
    movieName: "Malayalam Movie Scene",
    tags: [
      "mukesh",
      "jagadish",
      "godfather",
      "planning",
      "comedy"
    ],
    creator: "@godfather_clashes"
  },
  {
    title: "Enikku car engine ariyilla ennu njan paranjatha...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "car",
      "engine"
    ],
    creator: "@myboss_scenes"
  },
  {
    title: "Eda nee iranganam, nee irangiyaale vallathumokk nadakku... Aa contract enikk nashtappadaan paadilla!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "salimkumar",
      "cochinhaneefa",
      "manavalan",
      "business",
      "meeting"
    ],
    creator: "@manavalan_co"
  },
  {
    title: "Adhee okka kore kettu inde",
    movieName: "Malayalam Movie Scene",
    tags: [
      "Kittuni",
      "lottery"
    ],
    creator: "@peethambaran_gate"
  },
  {
    title: "mass... vare level anee nee",
    movieName: "Malayalam Movie Scene",
    tags: [
      "corridor",
      "funny"
    ],
    creator: "@moosa_shadows"
  },
  {
    title: "Sorry...sorry for everything",
    movieName: "Kochi Rajavu",
    tags: [
      "sorry",
      "dileep",
      "bandage",
      "comedy",
      "wedding"
    ],
    creator: "@ramankutty_cries"
  },
  {
    title: "Njan pinneyum vannu mone... Ullas!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "bridge",
      "walking",
      "comedy"
    ],
    creator: "@ullas_bridge"
  },
  {
    title: "Enthada ninte prashnam? Eda ninakkoru prashnamundaayaal njan undaavilla!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "confident",
      "relatable",
      "friends"
    ],
    creator: "@karikku_tales"
  },
  {
    title: "Pottanmaare... loka pottanmaaraanu!",
    movieName: "Interview meme",
    tags: [
      "Bala"
    ],
    creator: "@pappan_lecture"
  },
  {
    title: "Anganeyokk ang ponam... Verentha verentha... Avide engane sugamaanollo le?",
    movieName: "Malayalam Movie Scene",
    tags: [
      "conversation",
      "serious"
    ],
    creator: "@ullas_talks"
  },
  {
    title: "Maattangal enthellaam aayirunnu...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "change",
      "surprised",
      "funny",
      "jaysurya"
    ],
    creator: "@grandfather_looks"
  },
  {
    title: "Enthu prasakthi? Innu Indiayil enthu prasakthi enn chodichaal...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "politics",
      "question",
      "funny",
      "2 countries"
    ],
    creator: "@grandfather_looks"
  },
  {
    title: "Motivate cheyam.....Move on",
    movieName: "Malayalam Movie Scene",
    tags: [
      "hashiree",
      "mention",
      "funny"
    ],
    creator: "@ grandfather_looks"
  },
  {
    title: "Koduthu..Koduthu",
    movieName: "Malayalam Movie Scene",
    tags: [
      "Aju",
      "Nivin",
      "scared",
      "crowd",
      "funny"
    ],
    creator: "@damu_scared"
  },
  {
    title: "Scene okka maarum! Ithuvare ningal kandath katha padam, ini...",
    movieName: "Best Actor",
    tags: [
      "mass",
      "anger",
      "expression"
    ],
    creator: "@pappan_rage"
  },
  {
    title: "Nee vilikk, namukku nokkam!",
    movieName: "Malayalam Movie Scene",
    tags: [
      "challenge",
      "call",
      "friendship"
    ],
    creator: "@lalu_dark"
  },
  {
    title: "Ingane enthenkilumokk parayumpozhum ente manassil...",
    movieName: "Two Countries",
    tags: [
      "dileep",
      "siddique",
      "twocountries",
      "startup",
      "investor"
    ],
    creator: "@ullas_pitches"
  },
  {
    title: "Shocked",
    movieName: "Movie Scene",
    tags: [
      "rajanikanth",
      "shocked"
    ],
    creator: "@kannan_srank"
  },
  {
    title: "Pinne njan pala-ppozhum Keralathil kaanaarillallo... Njan full aayittum nammude business trip aanu... Japan, Italy, France, Germany, America, Canada...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "surajvenjaramoodu",
      "travel",
      "busy"
    ],
    creator: "@damu_lawyer"
  },
  {
    title: "Ariyillallo...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "clueless",
      "funny",
      "face"
    ],
    creator: "@peethambaran_si"
  },
  {
    title: "Ithaanu India Gate, paranja maathiri mathil illallo!",
    movieName: "Vellimunga",
    tags: [
      "biju menon",
      "shocked",
      "funny"
    ],
    creator: "@ramanan_shocks"
  },
  {
    title: "Appo povalle? Okay .....",
    movieName: "CID MOsa",
    tags: [
      "google",
      "bye",
      "funny"
    ],
    creator: "@peethambaran_si"
  },
  {
    title: "Arod venamenkilum njan kshamikkum, pakshe ninnod athundaavila... Ninne thirichariyaathe poyath, ninne njan athrayere snehichirunnakondaanu!",
    movieName: "Sagar alias Jacky",
    tags: [
      "mohanlal",
      "emotional",
      "police"
    ],
    creator: "@biju_si"
  },
  {
    title: "Nammale aanallo...",
    movieName: "Malayalam Movie Scene",
    tags: [
      "me",
      "shocked",
      "funny"
    ],
    creator: "@ grandfather_looks"
  },
  {
    title: "Ee thendi enthinaa avide kayariyirikkunnath?",
    movieName: "Malayalam Movie Scene",
    tags: [
      "thendi"
    ],
    creator: "@budget_meeting"
  },
  {
    title: "Ithu veno? Ithra naal kalicha poleyalla, ith valiya kaliyaakkunnath...",
    movieName: "Meme Compilation",
    tags: [
      "intense",
      "no pain no gain"
    ],
    creator: "@compilation_hub"
  },
  {
    title: "Kelkkaan sugamano?",
    movieName: "Meme Compilation",
    tags: [
      "supply"
    ],
    creator: "@compilation_hub"
  },
  {
    title: "Onnum randumalla, kuravundu... pala sizil pala reethiyil pidakkunnath!",
    movieName: "Meme Compilation",
    tags: [
      "mohanlal",
      "mass"
    ],
    creator: "@compilation_legends"
  }
];

export const mockMemes: VideoMeme[] = gdriveFiles.map((file, index) => {
  const meta = memeMetadataList[index] || {
    title: `Malayalam Meme Scene #${index + 1}`,
    movieName: "Classic Comedy",
    tags: ["malayalam", "comedy", "meme", "classic"],
    creator: "@malayalam_cinema"
  };
  
  const likes = 350 + (index * 43) % 2400;
  const shares = 80 + (index * 17) % 650;
  const views = likes * 5 + (index * 120) % 3500;
  const downloads = Math.round(shares * 0.45);

  return {
    id: `gdrive-${index + 1}`,
    title: meta.title,
    // Dynamically uses Cloudflare R2 in production/testing or local proxy in development
    videoUrl: USE_R2 
      ? `${R2_BUCKET_BASE_URL}/${file.name}` 
      : `/api/gdrive?id=${file.id}`,
    tags: meta.tags,
    likes,
    shares,
    views,
    downloads,
    movieName: meta.movieName,
    creator: meta.creator,
    originalIndex: index
  };
});
