const TelegramAPI = (function() {
    const BOT_TOKEN = "8631872058:AAGjX8NUvmC-fCUzlGqmy0DI1lqazWyIZEo";     // Вставьте сюда
    const CHANNEL_ID = -1002811478594;      // ID канала с минусом
    
    async function fetchChannelPosts(limit) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.ok) throw new Error('API error');
        
        // Фильтруем сообщения только из вашего канала
        const messages = data.result
            .filter(update => update.channel_post && update.channel_post.chat.id === CHANNEL_ID)
            .map(update => update.channel_post)
            .slice(0, limit);
        
        return messages;
    }
    
    return { getPosts: fetchChannelPosts };
})();