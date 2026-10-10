import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import {continueRender, delayRender} from 'remotion';

const handle = delayRender('fonts');
const families = [
  '500 20px "Space Grotesk"', '700 20px "Space Grotesk"',
  '400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter',
  '400 20px "JetBrains Mono"', '600 20px "JetBrains Mono"',
];
Promise.all(families.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
