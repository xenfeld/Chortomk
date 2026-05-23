const adjectives=["Turbo","Moon","Pepe","Bonk","Ultra","Diamond","Laser","Degen","Cosmic","Frog","Shiba","Wojak","Galaxy","Rocket"];
const nouns=["Coin","Cat","Dog","Inu","Monkey","Token","AI","Finance","Swap","Cash","Whale","King","Verse","Pump"];

export function generateMemeToken(){
  const a=adjectives[Math.floor(Math.random()*adjectives.length)];
  const n=nouns[Math.floor(Math.random()*nouns.length)];
  const name=`${a} ${n}`;
  const symbol=(a.slice(0,3)+n.slice(0,2)).toUpperCase();
  return {name,symbol,slogan:`${name} to the moon 🚀`};
}
