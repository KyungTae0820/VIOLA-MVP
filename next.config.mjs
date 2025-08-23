/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pugvzmcdnzhmxhgmpyvx.supabase.co', // 본인 프로젝트 도메인
        pathname: '/storage/v1/object/**',
      },
      // 리전이 *.supabase.in 인 경우 추가
      // { protocol: 'https', hostname: '*.supabase.in', pathname: '/storage/v1/object/**' },
    ],
  },
};

export default nextConfig;