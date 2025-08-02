//Dog API - 犬の画像
const axios = require('axios');
async function getDogImages() {
  console.log('\n🐕 Dog API - 犬の画像URL');
  console.log('取得中...\n');

  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random/3');
    const images = response.data.message;

    console.log('ランダムな犬の画像:');
    images.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

  } catch (error) {
    console.error('エラー:', error.message);
  }
}



//IP情報API - 現在のIP情報
async function getIpInfo() {
  console.log('\n🌐 IP情報API - 現在のIP情報');
  console.log('取得中...\n');

  try {
    const response = await axios.get('https://ipapi.co/json/');
    const ipInfo = response.data;

    console.log('現在のIP情報:');
    console.log(`- IP: ${ipInfo.ip}`);
    console.log(`- 国: ${ipInfo.country_name} (${ipInfo.country})`);
    console.log(`- 地域: ${ipInfo.region}`);
    console.log(`- 都市: ${ipInfo.city}`);
    console.log(`- ISP: ${ipInfo.org}`);
    console.log(`- タイムゾーン: ${ipInfo.timezone}`);

  } catch (error) {
    console.error('エラー:', error.message);
  }
}

//JSONPlaceholder - ダミーデータAPI
async function getJsonPlaceholderData() {
  console.log('📝 JSONPlaceholder - ダミーデータAPI');
  console.log('取得中...\n');

  try {
    // ユーザー情報を取得
    const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = usersResponse.data.slice(0, 3); // 最初の3人だけ表示

    console.log('ユーザー情報:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
      console.log(`  会社: ${user.company.name}`);
      console.log(`  住所: ${user.address.city}, ${user.address.street}`);
    });

    // 投稿を取得
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const posts = postsResponse.data;

    console.log('\n最新の投稿:');
    posts.forEach(post => {
      console.log(`- ${post.title}`);
      console.log(`  ${post.body.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('エラー:', error.message);
  }
}
