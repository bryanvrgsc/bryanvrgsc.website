export type Language = 'en' | 'es';

export interface Service {
    title: string;
    description: string;
    iconName: string;
    items: string[];
    valueProp: string[];
}

export interface PortfolioProject {
    title: string;
    problem: string;
    solution: string;
    tech: string;
    result: string;
    image: string;
    repoUrl?: string;
    videoUrl?: string;
    presentationUrl?: string;
    screenshots?: string[];
    details?: {
        currentFeatures?: string[];
        upcomingFeatures?: string[];
        techStack?: string[];
        documents?: { label: string; url: string }[];
    };
}

export interface BlogPost {
    title: string;
    excerpt: string;
    date: string;
    category: string;
}

export interface EngagementModel {
    iconName: string;
    label: string;
}

export interface UIText {
    homeLabels: {
        overview: string;
        collaboration: string;
        future: string;
        values: string;
    };
    heroTitle: string;
    heroSubtitle: string;
    heroTags: string;
    startProject: string;
    exploreWork: string;
    stats: {
        latency: string;
        uptime: string;
        security: string;
        global: string;
    };
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    values: {
        title: string;
        content: string;
    };
    services: {
        title: string;
        subtitle: string;
        impact: string;
        engagementModels: string;
    };
    portfolio: {
        title: string;
        subtitle: string;
        result: string;
        challenge: string;
        solution: string;
        viewDetails: string;
        modal: {
            caseStudy: string;
            overview: string;
            presentation: string;
            demoVideo: string;
            watchDemo: string;
            externalLink: string;
            features: string;
            techStack: string;
            documentation: string;
            roadmap: string;
            viewRepo: string;
            openTab: string;
            downloadPdf: string;
            pdfError: string;
        };
    };
    resources: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        allCategories: string;
        allDocuments: string;
        papers: string;
        slides: string;
        noResults: string;
    };
    contact: {
        title: string;
        subtitle: string;
        successTitle: string;
        successMessage: string;
        sendAnother: string;
        placeholders: {
            name: string;
            email: string;
            phone: string;
            message: string;
            budget: string;
        };
        button: {
            default: string;
            sending: string;
        };
        responseTime: string;
        errors: {
            name: string;
            email: string;
            message: string;
            network: string;
            generic: string;
        };
    };
    nav: {
        home: string;
        services: string;
        work: string;
        resources: string;
        contact: string;
    };
}
