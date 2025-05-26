export async function getToken(username, password, cf_clearance) {
    const url = "https://twoblade.com/login";
  
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        'Referer': 'https://twoblade.com/login',
        'Origin': 'https://twoblade.com',
        'Cookie': `cf_clearance=${cf_clearance}`
    };
  
    const body = new URLSearchParams({ username, password }).toString();
  
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
        redirect: 'manual'
    });
  
    const setCookies = response.headers.get('set-cookie')
    
    let authToken = null;
    if (setCookies.startsWith('auth_token=')) {
        authToken = setCookies.split(';')[0].split('=')[1];
    }
  
    if (!authToken) {
        throw new Error('auth_token cookie not found in login response :(((');
    }
  
    return authToken;
  }