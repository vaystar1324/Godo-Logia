// Основной модуль виджета
function initTelegramWidget(config) {
    const container = document.getElementById('telegramPosts');
    if (!container) return;
    
    async function loadAndDisplayPosts() {
        container.innerHTML = '<div class="loading">📡 Загружаем...</div>';
        
        try {
            const messages = await TelegramAPI.getPosts(
                config.channelUsername,
                config.postsLimit,
                config.apiProxy
            );
            
            if (!messages || messages.length === 0) {
                container.innerHTML = '<div class="error">Нет постов в канале</div>';
                return;
            }
            
            container.innerHTML = '';
            // Сортируем: от старых к новым (свежие внизу)
            messages.reverse().forEach(msg => {
                const postElement = createPostElement(msg);
                container.appendChild(postElement);
            });
            
        } catch (error) {
            console.error('Widget error:', error);
            container.innerHTML = `<div class="error">❌ Ошибка загрузки. Канал @${config.channelUsername} публичный?</div>`;
        }
    }
    
    function createPostElement(msg) {
        const div = document.createElement('div');
        div.className = 'post';
        
        // Текст поста
        if (msg.message) {
            const textDiv = document.createElement('div');
            textDiv.className = 'post-text';
            textDiv.innerHTML = formatMessageText(msg.message);
            div.appendChild(textDiv);
        }
        
        // Время публикации
        const date = new Date(msg.date * 1000);
        const dateDiv = document.createElement('div');
        dateDiv.className = 'post-date';
        dateDiv.textContent = formatDate(date);
        div.appendChild(dateDiv);
        
        return div;
    }
    
    function formatMessageText(text) {
        // Преобразуем ссылки в кликабельные
        return text
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="nofollow">$1</a>')
            .replace(/\n/g, '<br>');
    }
    
    function formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'только что';
        if (minutes < 60) return `${minutes} мин назад`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)} ч назад`;
        return date.toLocaleDateString();
    }
    
    // Запускаем загрузку
    loadAndDisplayPosts();
}