import calidadSoftware from '../assets/img/resources/calidad_software.webp';
import madurezEmpresa from '../assets/img/resources/madurez_empresa.webp';
import rsaCryptography from '../assets/img/resources/rsa_cryptography.webp';
import roiAgile from '../assets/img/resources/roi_agile.webp';
import roiTechSlides from '../assets/img/resources/roi_tech_slides.webp';

/**
 * Digital Library Documents Data
 * 
 * Contains metadata for all PDF documents in the digital library.
 * Documents are located in public/docs/files/
 */

export interface Document {
    id: string;
    filename: string;
    path: string;
    type: 'paper' | 'slides';
    image: string;
    title: {
        en: string;
        es: string;
    };
    description: {
        en: string;
        es: string;
    };
    detailedDescription: {
        en: string;
        es: string;
    };
    category: {
        en: string;
        es: string;
    };
}

export const DOCUMENTS: Document[] = [
    {
        id: 'calidad-software',
        filename: 'paper - Calidad del producto software.pdf',
        path: '/docs/files/paper - Calidad del producto software.pdf',
        type: 'paper',
        image: calidadSoftware.src,
        title: {
            en: 'Software Product Quality',
            es: 'Calidad del producto software'
        },
        description: {
            en: 'Comprehensive analysis of software quality metrics and best practices.',
            es: 'Análisis exhaustivo de métricas de calidad del software y mejores prácticas.'
        },
        detailedDescription: {
            en: 'This paper provides a comprehensive analysis of software quality metrics, standards like ISO 25010, and industry best practices for delivering high-quality software products. It covers quality attributes such as functionality, reliability, usability, efficiency, maintainability, and portability, along with practical frameworks for quality assessment and continuous improvement in software development processes.',
            es: 'Este documento proporciona un análisis exhaustivo de las métricas de calidad del software, estándares como ISO 25010, y las mejores prácticas de la industria para entregar productos de software de alta calidad. Cubre atributos de calidad como funcionalidad, fiabilidad, usabilidad, eficiencia, mantenibilidad y portabilidad, junto con marcos prácticos para la evaluación de calidad y mejora continua en los procesos de desarrollo de software.'
        },
        category: {
            en: 'Quality Assurance',
            es: 'Aseguramiento de Calidad'
        }
    },
    {
        id: 'madurez-empresa',
        filename: 'paper - Etapas de madurez de una empresa.pdf',
        path: '/docs/files/paper - Etapas de madurez de una empresa.pdf',
        type: 'paper',
        image: madurezEmpresa.src,
        title: {
            en: 'Company Maturity Stages',
            es: 'Etapas de madurez de una empresa'
        },
        description: {
            en: 'Framework for understanding organizational maturity levels.',
            es: 'Marco para comprender los niveles de madurez organizacional.'
        },
        detailedDescription: {
            en: 'This paper presents a comprehensive framework for understanding organizational maturity levels and the evolution path of technology companies. It explores the different stages from startup to enterprise, analyzing key characteristics, challenges, and success factors at each level. The document provides strategic insights for founders and executives navigating organizational growth and transformation.',
            es: 'Este documento presenta un marco integral para comprender los niveles de madurez organizacional y la ruta de evolución de las empresas tecnológicas. Explora las diferentes etapas desde startup hasta empresa consolidada, analizando características clave, desafíos y factores de éxito en cada nivel. El documento proporciona perspectivas estratégicas para fundadores y ejecutivos que navegan el crecimiento y transformación organizacional.'
        },
        category: {
            en: 'Business Strategy',
            es: 'Estrategia Empresarial'
        }
    },
    {
        id: 'rsa-cryptography',
        filename: 'paper - A Method for Obtaining Digital Signatures and Public-Key Cryptosystems.pdf',
        path: '/docs/files/paper - A Method for Obtaining Digital Signatures and Public-Key Cryptosystems.pdf',
        type: 'paper',
        image: rsaCryptography.src,
        title: {
            en: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
            es: 'Un método para obtener firmas digitales y criptosistemas de clave pública'
        },
        description: {
            en: 'The original 1978 RSA paper that revolutionized digital security.',
            es: 'El paper original de RSA de 1978 que revolucionó la seguridad digital.'
        },
        detailedDescription: {
            en: 'The groundbreaking 1978 paper by Ron Rivest, Adi Shamir, and Leonard Adleman that introduced the RSA algorithm. This seminal work describes a method for implementing a public-key cryptosystem and digital signature scheme based on the computational difficulty of factoring large prime numbers. RSA remains one of the most widely used encryption algorithms and foundational to modern internet security, including SSL/TLS, secure email, and cryptocurrency.',
            es: 'El revolucionario paper de 1978 por Ron Rivest, Adi Shamir y Leonard Adleman que introdujo el algoritmo RSA. Este trabajo fundamental describe un método para implementar un criptosistema de clave pública y esquema de firma digital basado en la dificultad computacional de factorizar números primos grandes. RSA sigue siendo uno de los algoritmos de cifrado más utilizados y fundamental para la seguridad moderna de internet, incluyendo SSL/TLS, correo electrónico seguro y criptomonedas.'
        },
        category: {
            en: 'Cybersecurity',
            es: 'Ciberseguridad'
        }
    },
    {
        id: 'roi-agile',
        filename: 'paper - Retorno Sobre la Inversión en Proyectos de Software Agiles.pdf',
        path: '/docs/files/paper - Retorno Sobre la Inversión en Proyectos de Software Agiles.pdf',
        type: 'paper',
        image: roiAgile.src,
        title: {
            en: 'ROI in Agile Software Projects',
            es: 'Retorno Sobre la Inversión en Proyectos de Software Ágiles'
        },
        description: {
            en: 'Methodology for calculating ROI in agile development projects.',
            es: 'Metodología para calcular el ROI en proyectos de desarrollo ágil.'
        },
        detailedDescription: {
            en: 'This paper provides a detailed methodology for calculating and maximizing return on investment in agile software development projects. It covers financial metrics specific to agile environments, including velocity-based ROI calculations, cost of delay analysis, and value stream mapping. The document offers practical tools and frameworks for product owners and stakeholders to make data-driven decisions about feature prioritization and resource allocation.',
            es: 'Este documento proporciona una metodología detallada para calcular y maximizar el retorno de inversión en proyectos de desarrollo de software ágil. Cubre métricas financieras específicas para entornos ágiles, incluyendo cálculos de ROI basados en velocidad, análisis de costo de retraso y mapeo de flujo de valor. El documento ofrece herramientas prácticas y marcos de trabajo para product owners y stakeholders para tomar decisiones basadas en datos sobre priorización de características y asignación de recursos.'
        },
        category: {
            en: 'Project Management',
            es: 'Gestión de Proyectos'
        }
    },
    {
        id: 'roi-tech-slides',
        filename: 'slides - Como medir el ROI de un proyecto tecnologico.pdf',
        path: '/docs/files/slides - Como medir el ROI de un proyecto tecnologico.pdf',
        type: 'slides',
        image: roiTechSlides.src,
        title: {
            en: 'How to Measure ROI in Tech Projects',
            es: 'Cómo medir el ROI de un proyecto tecnológico'
        },
        description: {
            en: 'Practical guide on metrics and KPIs for measuring tech project ROI.',
            es: 'Guía práctica sobre métricas y KPIs para medir el ROI de proyectos tecnológicos.'
        },
        detailedDescription: {
            en: 'A practical presentation covering metrics, KPIs, and proven frameworks for measuring return on investment in technology initiatives. This slide deck walks through the complete process of defining success criteria, establishing baseline measurements, tracking progress indicators, and calculating both tangible and intangible returns. Includes real-world case studies and templates for presenting ROI analysis to executive stakeholders.',
            es: 'Una presentación práctica que cubre métricas, KPIs y marcos probados para medir el retorno de inversión en iniciativas tecnológicas. Esta presentación recorre el proceso completo de definir criterios de éxito, establecer mediciones base, rastrear indicadores de progreso y calcular retornos tangibles e intangibles. Incluye estudios de caso reales y plantillas para presentar análisis de ROI a stakeholders ejecutivos.'
        },
        category: {
            en: 'Business Intelligence',
            es: 'Inteligencia de Negocios'
        }
    }
];

// Legacy export for backwards compatibility (if needed)
export const RESOURCES = {
    en: DOCUMENTS.map(doc => ({
        title: doc.title.en,
        excerpt: doc.description.en,
        date: '',
        category: doc.category.en
    })),
    es: DOCUMENTS.map(doc => ({
        title: doc.title.es,
        excerpt: doc.description.es,
        date: '',
        category: doc.category.es
    }))
};
