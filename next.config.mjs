/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mypetlifeimages.s3.amazonaws.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 's3.ap-northeast-2.amazonaws.com',
                pathname: '/**'
            }
        ],
    },
};

export default nextConfig;
