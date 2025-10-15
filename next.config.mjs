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
    images: {
        domains: [
            process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || 'ehwzmnpmtukqybibgwuk.supabase.co'
        ],
    },
};

export default nextConfig;
