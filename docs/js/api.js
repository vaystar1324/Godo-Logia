// Модуль для работы с Telegram API
const TelegramAPI = (function() {
    
    async function fetchChannelPosts(channelUsername, limit, proxyUrl) {
        const url = `${proxyUrl}/channels.getMessages?channel=@${channelUsername}&limit=${limit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.ok || !data.result || !data.result.messages) {
            throw new Error('Invalid API response');
        }
        
        return data.result.messages;
    }
    
    async function fetchMediaFile(fileId, proxyUrl) {
        // Функция для загрузки медиа (опционально)
        const url = `${proxyUrl}/getFile?file_id=${fileId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Media fetch failed');
        return response.json();
    }
    
    return {
        getPosts: fetchChannelPosts,
        getMedia: fetchMediaFile
    };
})();