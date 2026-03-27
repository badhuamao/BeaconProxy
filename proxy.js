export default async function handler(req, res) {
    // 1. 获取请求路径和参数 (例如 /sub?token=xxx)
    const url = new URL(req.url, `https://${req.headers.host}`);
    
    // 2. 构造目标源站 URL
    const targetDomain = "beacon-api.ssdxz.cn";
    const targetUrl = `https://${targetDomain}${url.pathname.replace('/api/proxy', '')}${url.search}`;

    try {
        // 3. 发起请求（使用 Vercel 的 IP 发出，完美绕过 CF 封锁）
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": `https://${targetDomain}/`,
                "Host": targetDomain
            }
        });

        // 4. 获取返回内容
        const data = await response.text();

        // 5. 设置响应头
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", response.headers.get("content-type") || "text/plain");

        // 6. 返回数据
        res.status(response.status).send(data);

    } catch (error) {
        res.status(500).send("❌ Vercel 中转异常: " + error.message);
    }
}