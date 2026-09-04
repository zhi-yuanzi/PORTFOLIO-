import { readFile, writeFile } from 'node:fs/promises';
const assets = JSON.parse(await readFile('src/assets.json', 'utf8').then(s => s.replace(/^\uFEFF/, '')));
const items = [['portrait', assets.portrait], ...assets.decorations.map((url,i)=>[`decoration-${i+1}`,url]), ...assets.projectImages.map((url,i)=>[`project-${i+1}`,url]), ...assets.marquee.map((url,i)=>[`reel-${i+1}`,url])];
const manifest = {};
let cursor=0;
async function worker() {
  while(cursor<items.length) {
    const [name,url]=items[cursor++];
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
      const type=response.headers.get('content-type')||'';
      if (!response.ok || !type.startsWith('image/')) throw new Error(`HTTP ${response.status}, ${type}`);
      const buffer=Buffer.from(await response.arrayBuffer());
      const ext=type.includes('webp')?'webp':type.includes('gif')?'gif':type.includes('jpeg')?'jpg':'png';
      const path=`/media/${name}.${ext}`;
      await writeFile(`public${path}`,buffer);
      manifest[url]=path;
      console.log('SAVED', name, buffer.length);
    } catch(error) { manifest[url]=''; console.log('UNAVAILABLE',name,error.message); }
  }
}
await Promise.all(Array.from({length:4},worker));
await writeFile('src/local-assets.json',JSON.stringify(manifest,null,2)+'\n');
console.log('COMPLETE',Object.keys(manifest).length,'of',items.length);

