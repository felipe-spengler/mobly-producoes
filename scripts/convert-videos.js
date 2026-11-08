import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const moblyDir = path.resolve('Mobly');
const outputDir = path.resolve('public/videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const movFiles = fs.readdirSync(moblyDir).filter(f => f.toLowerCase().endsWith('.mov'));

console.log(`Found ${movFiles.length} .mov files in ${moblyDir}`);

async function convertFile(file, index) {
  const inputPath = path.join(moblyDir, file);
  const outName = `mobly_showreel_${index + 1}.mp4`;
  const outputPath = path.join(outputDir, outName);

  console.log(`\n[${index + 1}/${movFiles.length}] Converting ${file} -> ${outName}...`);

  const args = [
    '-nostdin',
    '-y',
    '-i', inputPath,
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });
    proc.on('close', code => {
      if (code === 0) {
        const stats = fs.statSync(outputPath);
        console.log(`✓ Finished ${outName}: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
        resolve({ file, outName, size: stats.size });
      } else {
        console.error(`✗ Error converting ${file} (code ${code}):`, stderr.slice(-300));
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

async function run() {
  const results = [];
  for (let i = 0; i < movFiles.length; i++) {
    const res = await convertFile(movFiles[i], i);
    results.push(res);
  }
  console.log('\nAll conversions complete! Results:');
  console.table(results);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

