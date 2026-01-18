import type { RedirectRequest, RedirectResponse } from './types';

// Декларация для глобального объекта Telegram
declare const window: any;

async function initMiniApp() {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const startParam = tg.initDataUnsafe.start_param;
    const initData = tg.initData;

    if (!startParam) {
        console.error("No start param found");
        return;
    }

    try {
        const payload: RedirectRequest = { initData, startParam };
        
        const response = await fetch('BACKEND-API', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data: RedirectResponse = await response.json();

        if (data.url) {
            // Перекидываем пользователя в happ
            window.location.replace(data.url);
        }
    } catch (err) {
        console.error("Redirect failed", err);
    }
}

window.addEventListener('load', initMiniApp);