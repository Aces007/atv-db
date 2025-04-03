/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        }
    },
};

export default nextConfig;
