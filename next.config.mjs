/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack:(config,{buildId,dev,isServer,defaultoaders,webpack})=>{
        config.resolve.alias.canvas=false
    config.resolve.alias.encoding=false
    return config},
};

export default nextConfig;
