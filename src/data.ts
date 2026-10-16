import sourceAssets from './assets.json';
import cachedAssets from './local-assets.json';

const localAssets: Record<string, string> = cachedAssets;
const resolveAsset = (url: string) => {
  const resolved = localAssets[url] ?? url;
  return resolved.startsWith('/media/') ? resolved.slice(1) : resolved;
};
const mediaAsset = (name: string) => `media/${name}`;
const assets = {
  decorations: sourceAssets.decorations.map(resolveAsset),
};

// Replace these values with your own details. Empty project URLs open a preview.
export const profile = { name: '知圆子', email: '3526642834@qq.com' };
export const heroHand = mediaAsset('hero-hand.png');
export const heroCharacter = mediaAsset('hero-character.png');
export const reelVideos = [
  mediaAsset('reel-01.mp4'),
  mediaAsset('reel-03.mp4'),
  mediaAsset('reel-02.mp4'),
  mediaAsset('reel-04.mp4'),
  mediaAsset('reel-05.mp4'),
  mediaAsset('reel-06.mp4'),
];
export const aboutText = `具备扎实的视觉设计功底，专注AI动态视频与视觉叙事。
我热爱创作富有表现力、承载文化内涵与生动故事的影像。
让我们一同打造惊艳的作品！`;
export const services = [
  { name: '耳机PVC广告 | 方寸之间', description: '西胜xisemh1-por耳机AI广告，以“方寸之间”为主题，打造氛围感品牌宣传短片。' },
  { name: '影视二创剪辑 | 沉睡魔咒', description: '采用黑金涂抹艺术画风，对《沉睡魔咒》进行二次剪辑重构，演绎全新故事表达。' },
  { name: '电商广告 | 魔动冷热杯', description: 'AI制作产品电商短片，突出魔动冷热杯产品特点，适配商品宣传推广。' },
  { name: '短剧主题曲MV | 逆光上场', description: '为短剧《荣耀予她》的主题曲《逆光上场》，AI制作配套歌曲MV影像。' },
];
export type Project = { name: string; category: string; discipline: string; url: string; images: string[]; video?: string; previewVideo?: string; previewPause?: number; videoPoster?: string; audio?: string };
export const projects: Project[] = [
  { name: '耳机PVC广告 | 方寸之间', category: 'WORKS', discipline: 'AI product advertising / Visual storytelling', url: '', images: [mediaAsset('project-01-poster.png'), mediaAsset('project-01-product.png')], video: mediaAsset('project-01-video.mp4'), previewVideo: mediaAsset('project-01-preview.mp4'), previewPause: 1000, videoPoster: mediaAsset('project-01-poster.png') },
  { name: '影视二创剪辑 | 沉睡魔咒', category: 'WORKS', discipline: 'AI film re-editing / Visual storytelling', url: '', images: [mediaAsset('project-02-poster.png'), mediaAsset('project-02-logo.png')], video: mediaAsset('project-02-video.mp4'), previewVideo: mediaAsset('project-02-preview.mp4'), previewPause: 1000, videoPoster: mediaAsset('project-02-poster.png') },
  { name: '电商广告 | 魔动冷热杯', category: 'WORKS', discipline: 'AI product advertising / E-commerce visual', url: '', images: [mediaAsset('project-03-poster.png'), mediaAsset('project-03-product.png')], video: mediaAsset('project-03-video.mp4'), previewVideo: mediaAsset('project-03-preview.mp4'), previewPause: 1000, videoPoster: mediaAsset('project-03-poster.png') },
  { name: '短剧主题曲MV | 逆光上场', category: 'WORKS', discipline: 'AI music visual / Motion storytelling', url: '', images: [mediaAsset('project-04-cover.png')], video: mediaAsset('project-04-video.mp4'), previewVideo: mediaAsset('project-04-preview-seamless.mp4'), videoPoster: mediaAsset('project-04-video-poster.jpg'), audio: mediaAsset('project-04-audio.mp3') },
];
export { assets };

