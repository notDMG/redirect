import type { RedirectRequest, RedirectResponse } from './types';

declare const window: any;

async function initMiniApp() {
    const tg = window.Telegram.WebApp;
    const statusElement = document.getElementById('status');

    tg.ready();
    tg.expand();

    const startParam = tg.initDataUnsafe.start_param;
    const initData = tg.initData;

    if (!startParam) {
        if (statusElement) {
            statusElement.innerText = 'Ошибка: Ссылка не содержит ключ доступа';
        }
        console.error("No start param found");
        return;
    }

    try {
        const payload: RedirectRequest = { initData, startParam };
        //todo: подключить backend
        const response = await fetch('http://localhost:3000/get-target-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (statusElement) statusElement.innerText = 'Доступ запрещен или ссылка устарела';
            return;
        }

        const data: RedirectResponse = await response.json();

        if (data.url) {
            window.location.replace(data.url);
        } else {
            if (statusElement) statusElement.innerText = 'Целевой URL не получен';
        }
    } catch (err) {
        if (statusElement) statusElement.innerText = 'Ошибка соединения с сервером';
        console.error("Redirect failed", err);
    }
}

window.addEventListener('DOMContentLoaded', initMiniApp);