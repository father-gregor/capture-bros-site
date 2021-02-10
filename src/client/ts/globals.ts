declare const ENV: 'development' | 'production';
declare const config: Config.RootObject;

declare module Config {

    export interface Social {
        ogUrl: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
    }

    export interface Head {
        title: string;
        description: string;
        social: Social;
    }

    export interface General {
        contactEmail: string;
    }

    export interface BuildSettingPerEnv {
        contactFormEndpoint: string;
    }

    export interface BuildSettings {
        development: BuildSettingPerEnv;
        production: BuildSettingPerEnv;
    }

    export interface Channel {
        name: string;
        url: string;
        logo: string;
    }

    export interface Video {
        url: string;
        title: string;
        type: string;
        views: string;
        channels: Channel[];
    }

    export interface FeaturedVideos {
        width: number;
        videos: Video[];
    }

    export interface Client {
        name: string;
        url: string;
        imgUrl: string;
    }

    export interface FeaturedClients {
        imgWidth: number;
        clients: Client[];
    }

    export interface RootObject {
        head: Head;
        general: General;
        buildSettings: BuildSettings;
        featuredVideos: FeaturedVideos;
        featuredClients: FeaturedClients;
    }

}

