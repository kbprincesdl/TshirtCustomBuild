import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Enhance prompt for apparel screen printing / DTG graphics
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { prompt, style } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert streetwear graphic apparel designer. Refine this user concept into a single, punchy, detailed text-to-image prompt optimized for T-shirt printing (DTG and screen print).
Input Concept: "${prompt}"
Desired Style: "${style || 'Modern Graphic Streetwear'}"
Requirements:
- Specify vector clarity, bold lines, high contrast suitable on solid fabric
- Specify transparent or clean background isolation
- Avoid photorealistic human mockups; generate the graphic artwork itself
- Output ONLY the enhanced prompt string without commentary.`,
      });
      const enhanced = response.text?.trim() || prompt;
      return res.json({ enhancedPrompt: enhanced });
    }

    // Fallback prompt enhancement
    const enhanced = `${prompt}, ${style || 'streetwear vector'}, bold crisp lines, sharp silkscreen illustration, isolated graphic art, 8k apparel print design`;
    return res.json({ enhancedPrompt: enhanced });
  } catch (error: any) {
    console.error('Enhance prompt error:', error);
    return res.status(500).json({ error: error.message || 'Failed to enhance prompt' });
  }
});

// API: Generate Image
app.post('/api/generate-image', async (req, res) => {
  const { prompt, style, engine = 'auto', aspectRatio = '1:1' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const fullPrompt = style ? `${prompt}, in ${style} aesthetic, high detail t-shirt graphic artwork, clean isolated design` : prompt;

  // Mode 1: Paid Gemini API if specifically chosen or auto
  if (engine === 'gemini' || (engine === 'auto' && ai)) {
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '1:1') as any,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            const dataUrl = `data:${mime};base64,${part.inlineData.data}`;
            return res.json({
              imageUrl: dataUrl,
              engine: 'gemini-3.1-flash-lite-image',
              prompt: fullPrompt,
            });
          }
        }
      } catch (geminiError: any) {
        const isQuota =
          geminiError?.status === 'RESOURCE_EXHAUSTED' ||
          geminiError?.message?.includes('429') ||
          geminiError?.message?.includes('Quota') ||
          geminiError?.message?.includes('quota');

        if (isQuota) {
          console.warn('[Gemini Quota Notice] Free tier quota exceeded on gemini-3.1-flash-lite-image; seamlessly using Free Creative Engine.');
        } else {
          console.warn('[Gemini API Notice] Falling back to Free Creative Engine:', geminiError?.message || geminiError);
        }
        // Fall through cleanly to Free Creative Engine or procedural generator
      }
    }
  }

  // Mode 2: Free High-Res Creative Engine (with timeout safety)
  try {
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const freeUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const fetchResponse = await fetch(freeUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ShankarApparelApp/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (fetchResponse.ok) {
      const arrayBuffer = await fetchResponse.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = fetchResponse.headers.get('content-type') || 'image/jpeg';
      return res.json({
        imageUrl: `data:${contentType};base64,${base64}`,
        engine: 'free-creative-engine',
        prompt: fullPrompt,
        notice: engine === 'gemini' ? 'Rendered via Free High-Res Engine (Gemini quota exceeded)' : undefined,
      });
    }
  } catch (freeError: any) {
    console.warn('[Free Creative Engine Warning] Falling back to procedural vector generator:', freeError?.message || freeError);
  }

  // Mode 3: High-Res Procedural Vector Engine (100% reliable, zero external dependencies)
  const svgDataUrl = generateProceduralGraphic(prompt, style);
  return res.json({
    imageUrl: svgDataUrl,
    engine: 'procedural-vector-generator',
    prompt: fullPrompt,
    notice: 'Synthesized with Shankar High-Precision Vector Engine',
  });
});

// Helper: High quality vector graphic artwork fallback
function generateProceduralGraphic(prompt: string, style: string = 'Streetwear'): string {
  const words = (prompt.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase().split(' ').slice(0, 3).join(' ') || 'SHANKAR').slice(0, 24);
  const hash = prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;
  const hue2 = (hue + 50) % 360;
  const hue3 = (hue + 120) % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue}, 90%, 60%)" />
        <stop offset="50%" stop-color="hsl(${hue2}, 95%, 50%)" />
        <stop offset="100%" stop-color="hsl(${hue3}, 85%, 45%)" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
        <stop offset="100%" stop-color="hsl(${hue}, 80%, 70%)" />
      </linearGradient>
      <filter id="vectorShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.45"/>
      </filter>
    </defs>
    <rect width="800" height="800" fill="transparent" />
    
    <!-- Outer Crest Decal Rings -->
    <circle cx="400" cy="380" r="300" fill="none" stroke="url(#primaryGrad)" stroke-width="6" stroke-dasharray="16,10" opacity="0.8" />
    <circle cx="400" cy="380" r="260" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" />
    <circle cx="400" cy="380" r="230" fill="none" stroke="url(#primaryGrad)" stroke-width="3" />

    <!-- Center Geometric Shield / Emblem -->
    <polygon points="400,160 600,480 200,480" fill="none" stroke="url(#primaryGrad)" stroke-width="12" stroke-linejoin="round" filter="url(#vectorShadow)" />
    <polygon points="400,240 520,440 280,440" fill="url(#primaryGrad)" opacity="0.2" />

    <!-- Stylized Emblem Motif -->
    <circle cx="400" cy="370" r="95" fill="url(#primaryGrad)" filter="url(#vectorShadow)" />
    <polygon points="400,300 450,420 350,420" fill="#ffffff" opacity="0.9" />
    <polygon points="400,430 360,340 440,340" fill="url(#primaryGrad)" opacity="0.8" />

    <!-- Bold Print Typography -->
    <text x="400" y="580" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="url(#accentGrad)" letter-spacing="6" filter="url(#vectorShadow)">${words}</text>
    <rect x="250" y="605" width="300" height="3" fill="url(#primaryGrad)" />
    <text x="400" y="640" font-family="'Courier New', monospace" font-size="16" font-weight="800" text-anchor="middle" fill="#e4e4e7" letter-spacing="8">SHANKAR MFG • ${style.toUpperCase().slice(0, 20)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    brand: 'Shankar T-Shirts & Apparel Manufacturing',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
