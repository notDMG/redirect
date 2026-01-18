import express from 'express';
import type { Request, Response } from 'express'; 
import crypto from 'crypto';
import cors from 'cors';
import type { RedirectRequest, RedirectResponse } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = ''; // вставить токен

const REDIRECT_MAP: Record<string, string> = {
    "key_abc123": "https://target-happ.com/page1",
};

function verifyTelegramData(initData: string): boolean {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
}

app.post('/get-target-url', (
    req: Request<{}, {}, RedirectRequest>, 
    res: Response<RedirectResponse>
) => {
    const { initData, startParam } = req.body;

    if (!verifyTelegramData(initData)) {
        return res.status(403).json({ error: 'Invalid data signature' });
    }

    const targetUrl = REDIRECT_MAP[startParam];
    if (targetUrl) {
        res.json({ url: targetUrl });
    } else {
        res.status(404).json({ error: 'Link not found' });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));