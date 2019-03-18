const request = require('request-promise');
const cheerio = require('cheerio');
module.exports = function(username){
/* Create the base function to be ran */
const start = async () => {
    /* Here you replace the username with your actual instagram username that you want to check */
    const BASE_URL = `https://www.instagram.com/${username}/`;
    /* Send the request and get the html content */
    let response = await request(
        BASE_URL,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    );

    /* Initiate Cheerio with the response */
    let $ = cheerio.load(response);

    /* Get the proper script of the html page which contains the json */
    let script = $('script').eq(4).html();

    /* Traverse through the JSON of instagram response */
    let { entry_data: { ProfilePage : {[0] : { graphql : {user} }} } } = JSON.parse(/window._sharedData = (.+);/g.exec(script)[1]);

    /* Output the data */
    let followersCount = user.edge_followed_by.count;
    let edges = user.edge_owner_to_timeline_media.edges;
    let totalPosts = user.edge_owner_to_timeline_media.count;

    let comments = 0;
    let likes = 0;
    edges.forEach(function(item){
        comments += item.node.edge_media_to_comment.count;
        likes += item.node.edge_liked_by.count
    });

    return {comments, likes, followersCount, totalPosts};
    debugger;
}
start().then((result) => {
    return result;
});
return start()
}