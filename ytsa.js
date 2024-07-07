const keyword = `alan walker faded`;
const Youtube = require('youtube-search-api');

(async () => {
    try {
        var data = (await Youtube.GetListByKeyword(keyword, false, 6)).items;
        if (data.length === 0) {
            api.sendMessage('No results found.', event.threadID, event.messageID);
            return;
        }
        var result = data[0];

        console.log(result);
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
    }
})();