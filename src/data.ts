import sourceAssets from './assets.json';
import cachedAssets from './local-assets.json';

const localAssets: Record<string, string> = cachedAssets;
const resolveAsset = (url: string) => localAssets[url] ?? url;
const assets = {
  portrait: resolveAsset(sourceAssets.portrait),
  decorations: sourceAssets.decorations.map(resolveAsset),
  projectImages: sourceAssets.projectImages.map(resolveAsset),
  marquee: sourceAssets.marquee.map(resolveAsset),
};

// Replace these values with your own details. Empty project URLs open a preview.
export const profile = { name: 'Jack', email: '' };
export const aboutText = "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";
export const services = [
  { name: '3D Modeling', description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.' },
  { name: 'Rendering', description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.' },
  { name: 'Motion Design', description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.' },
  { name: 'Branding', description: 'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.' },
  { name: 'Web Design', description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.' },
];
export const projects = [
  { name: 'Nextlevel Studio', category: 'Client', discipline: 'Art direction / 3D design', url: '', images: assets.projectImages.slice(0, 3) },
  { name: 'Aura Brand Identity', category: 'Personal', discipline: 'Brand identity / Visual exploration', url: '', images: assets.projectImages.slice(3, 6) },
  { name: 'Solaris Digital', category: 'Client', discipline: 'Digital design / 3D illustration', url: '', images: assets.projectImages.slice(6, 9) },
];
export type Project = (typeof projects)[number];
export { assets };

