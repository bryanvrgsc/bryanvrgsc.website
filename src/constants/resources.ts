import calidadSoftware from '../assets/img/resources/calidad_software.avif';
import madurezEmpresa from '../assets/img/resources/madurez_empresa.avif';
import rsaCryptography from '../assets/img/resources/rsa_cryptography.avif';
import roiAgile from '../assets/img/resources/roi_agile.avif';
import roiTechSlides from '../assets/img/resources/roi_tech_slides.avif';
import relationalModelCodd from '../assets/img/resources/A Relational Model of Data for Large Shared Data Banks.avif';
import shannonRelaySwitching from '../assets/img/resources/A Symbolic Analysis of Relay and Switching Circuits.avif';
import mapreduceDeanGhemawat from '../assets/img/resources/MAPREDUCE.avif';
import turingComputingMachinery from '../assets/img/resources/MIND.avif';
import diffieHellmanCryptography from '../assets/img/resources/New Directions in Cryptography.avif';
import brooksNoSilverBullet from '../assets/img/resources/No Silver Bullet.avif';
import shannonMathematicalTheory from '../assets/img/resources/The Bell System Technical Journal.avif';
import disciplinedAgileFramework from '../assets/img/resources/The Disciplined Agile Process Decision Framework.avif';
import googleFileSystem from '../assets/img/resources/The Google File System.avif';
import saltzerSchroederProtection from '../assets/img/resources/The Protection of Information in Computer Systems.avif';
import cvPreview from '../assets/img/resources/CV.avif';

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
        id: 'cv-bryan-vargas',
        filename: 'bryan-alan-vargas-chavez_20260127_1306.pdf',
        path: '/docs/files/bryan-alan-vargas-chavez_20260127_1306.pdf',
        type: 'paper',
        image: cvPreview.src,
        title: {
            en: 'CV - Bryan Alan Vargas Chávez',
            es: 'CV - Bryan Alan Vargas Chávez'
        },
        description: {
            en: 'Professional CV of Bryan Alan Vargas Chávez.',
            es: 'CV profesional de Bryan Alan Vargas Chávez.'
        },
        detailedDescription: {
            en: 'Comprehensive professional background, technical skills, and experience of Bryan Alan Vargas Chávez.',
            es: 'Trayectoria profesional completa, habilidades técnicas y experiencia de Bryan Alan Vargas Chávez.'
        },
        category: {
            en: 'Personal',
            es: 'Personal'
        }
    },
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
            en: 'This paper provides a comprehensive analysis of software quality metrics, standards like ISO 25010, and industry best practices for delivering high-quality software products.',
            es: 'Este documento proporciona un análisis exhaustivo de las métricas de calidad del software, estándares como ISO 25010, y las mejores prácticas de la industria para entregar productos de software de alta calidad.'
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
            en: 'This paper presents a comprehensive framework for understanding organizational maturity levels and the evolution path of technology companies.',
            es: 'Este documento presenta un marco integral para comprender los niveles de madurez organizacional y la ruta de evolución de las empresas tecnológicas.'
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
            en: 'The groundbreaking 1978 paper by Ron Rivest, Adi Shamir, and Leonard Adleman that introduced the RSA algorithm.',
            es: 'El revolucionario paper de 1978 por Ron Rivest, Adi Shamir y Leonard Adleman que introdujo el algoritmo RSA.'
        },
        category: {
            en: 'Cybersecurity',
            es: 'Ciberseguridad'
        }
    },
    {
        id: 'relational-model-codd',
        filename: 'paper - A Relational Model of Data for Large Shared Data Banks.pdf',
        path: '/docs/files/paper - A Relational Model of Data for Large Shared Data Banks.pdf',
        type: 'paper',
        image: relationalModelCodd.src,
        title: {
            en: 'A Relational Model of Data for Large Shared Data Banks',
            es: 'Un modelo relacional de datos para grandes bancos de datos compartidos'
        },
        description: {
            en: 'Codd\'s seminal paper that introduced the relational database model.',
            es: 'El paper fundamental de Codd que introdujo el modelo de base de datos relacional.'
        },
        detailedDescription: {
            en: 'The 1970 paper by E.F. Codd that established the theoretical foundation for relational databases.',
            es: 'El paper de 1970 por E.F. Codd que estableció la base teórica para las bases de datos relacionales.'
        },
        category: {
            en: 'Databases',
            es: 'Bases de Datos'
        }
    },
    {
        id: 'shannon-relay-switching',
        filename: 'paper - A Symbolic Analysis of Relay and Switching Circuits.pdf',
        path: '/docs/files/paper - A Symbolic Analysis of Relay and Switching Circuits.pdf',
        type: 'paper',
        image: shannonRelaySwitching.src,
        title: {
            en: 'A Symbolic Analysis of Relay and Switching Circuits',
            es: 'Un análisis simbólico de circuitos de relés y conmutación'
        },
        description: {
            en: 'Shannon\'s master\'s thesis that applied Boolean algebra to digital circuits.',
            es: 'La tesis de maestría de Shannon que aplicó el álgebra de Boole a los circuitos digitales.'
        },
        detailedDescription: {
            en: 'Claude Shannon\'s 1938 thesis that proved Boolean algebra could be used to design and analyze digital circuits.',
            es: 'La tesis de 1938 de Claude Shannon que demostró que el álgebra de Boole podía usarse para diseñar y analizar circuitos digitales.'
        },
        category: {
            en: 'Computer Science',
            es: 'Ciencias de la Computación'
        }
    },
    {
        id: 'mapreduce-dean-ghemawat',
        filename: 'paper - MAPREDUCE: SIMPLIFIED DATA PROCESSING ON LARGE CLUSTERS.pdf',
        path: '/docs/files/paper - MAPREDUCE: SIMPLIFIED DATA PROCESSING ON LARGE CLUSTERS.pdf',
        type: 'paper',
        image: mapreduceDeanGhemawat.src,
        title: {
            en: 'MapReduce: Simplified Data Processing on Large Clusters',
            es: 'MapReduce: Procesamiento de datos simplificado en grandes clusters'
        },
        description: {
            en: 'Google\'s paper describing the MapReduce programming model.',
            es: 'El paper de Google que describe el modelo de programación MapReduce.'
        },
        detailedDescription: {
            en: 'The 2004 paper by Jeffrey Dean and Sanjay Ghemawat that introduced the MapReduce framework for large-scale data processing.',
            es: 'El paper de 2004 de Jeffrey Dean y Sanjay Ghemawat que introdujo el framework MapReduce para el procesamiento de datos a gran escala.'
        },
        category: {
            en: 'Distributed Systems',
            es: 'Sistemas Distribuidos'
        }
    },
    {
        id: 'turing-computing-machinery',
        filename: 'paper - MIND A QUARTERLY REVIEW.pdf',
        path: '/docs/files/paper - MIND A QUARTERLY REVIEW.pdf',
        type: 'paper',
        image: turingComputingMachinery.src,
        title: {
            en: 'Computing Machinery and Intelligence',
            es: 'Maquinaria de computación e inteligencia'
        },
        description: {
            en: 'Alan Turing\'s paper that introduced the Turing Test.',
            es: 'El paper de Alan Turing que introdujo la Prueba de Turing.'
        },
        detailedDescription: {
            en: 'The 1950 paper by Alan Turing that explores the question "Can machines think?" and proposes the imitation game.',
            es: 'El paper de 1950 de Alan Turing que explora la pregunta "¿Pueden las máquinas pensar?" y propone el juego de la imitación.'
        },
        category: {
            en: 'Artificial Intelligence',
            es: 'Inteligencia Artificial'
        }
    },
    {
        id: 'diffie-hellman-cryptography',
        filename: 'paper - New Directions in Cryptography.pdf',
        path: '/docs/files/paper - New Directions in Cryptography.pdf',
        type: 'paper',
        image: diffieHellmanCryptography.src,
        title: {
            en: 'New Directions in Cryptography',
            es: 'Nuevas direcciones en criptografía'
        },
        description: {
            en: 'The paper that introduced public-key cryptography.',
            es: 'El paper que introdujo la criptografía de clave pública.'
        },
        detailedDescription: {
            en: 'The 1976 paper by Whitfield Diffie and Martin Hellman that forever changed the field of cryptography.',
            es: 'El paper de 1976 de Whitfield Diffie y Martin Hellman que cambió para siempre el campo de la criptografía.'
        },
        category: {
            en: 'Cybersecurity',
            es: 'Ciberseguridad'
        }
    },
    {
        id: 'brooks-no-silver-bullet',
        filename: 'paper - No Silver Bullet.pdf',
        path: '/docs/files/paper - No Silver Bullet.pdf',
        type: 'paper',
        image: brooksNoSilverBullet.src,
        title: {
            en: 'No Silver Bullet — Essence and Accident in Software Engineering',
            es: 'No hay balas de plata: Esencia y accidente en la ingeniería de software'
        },
        description: {
            en: 'Brooks explains why software engineering is inherently difficult.',
            es: 'Brooks explica por qué la ingeniería de software es inherentemente difícil.'
        },
        detailedDescription: {
            en: 'The 1986 paper by Fred Brooks that discusses the essential and accidental complexities of software development.',
            es: 'El paper de 1986 de Fred Brooks que discute las complejidades esenciales y accidentales del desarrollo de software.'
        },
        category: {
            en: 'Software Engineering',
            es: 'Ingeniería de Software'
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
            en: 'Practical methodology for calculating and maximizing ROI in agile environments.',
            es: 'Metodología práctica para calcular y maximizar el ROI en entornos ágiles.'
        },
        category: {
            en: 'Project Management',
            es: 'Gestión de Proyectos'
        }
    },
    {
        id: 'shannon-mathematical-theory',
        filename: 'paper - The Bell System Technical Journal.pdf',
        path: '/docs/files/paper - The Bell System Technical Journal.pdf',
        type: 'paper',
        image: shannonMathematicalTheory.src,
        title: {
            en: 'A Mathematical Theory of Communication',
            es: 'Una teoría matemática de la comunicación'
        },
        description: {
            en: 'The paper that founded information theory.',
            es: 'El paper que fundó la teoría de la información.'
        },
        detailedDescription: {
            en: 'Claude Shannon\'s 1948 paper that established the foundations of information theory and modern communication.',
            es: 'El paper de 1948 de Claude Shannon que estableció las bases de la teoría de la información y la comunicación moderna.'
        },
        category: {
            en: 'Information Theory',
            es: 'Teoría de la Información'
        }
    },
    {
        id: 'disciplined-agile-framework',
        filename: 'paper - The Disciplined Agile Process Decision Framework.pdf',
        path: '/docs/files/paper - The Disciplined Agile Process Decision Framework.pdf',
        type: 'paper',
        image: disciplinedAgileFramework.src,
        title: {
            en: 'The Disciplined Agile Process Decision Framework',
            es: 'El marco de decisión de procesos ágiles disciplinados'
        },
        description: {
            en: 'Introduction to Agile Software Development with the DA framework.',
            es: 'Introducción al desarrollo ágil de software con el marco DA.'
        },
        detailedDescription: {
            en: 'Scott Ambler\'s 2015 paper on the Disciplined Agile (DA) framework for enterprise agility.',
            es: 'El paper de 2015 de Scott Ambler sobre el marco Disciplined Agile (DA) para la agilidad empresarial.'
        },
        category: {
            en: 'Agile',
            es: 'Agilidad'
        }
    },
    {
        id: 'google-file-system',
        filename: 'paper - The Google File System.pdf',
        path: '/docs/files/paper - The Google File System.pdf',
        type: 'paper',
        image: googleFileSystem.src,
        title: {
            en: 'The Google File System',
            es: 'El sistema de archivos de Google'
        },
        description: {
            en: 'A scalable distributed file system.',
            es: 'Un sistema de archivos distribuido escalable.'
        },
        detailedDescription: {
            en: 'The 2003 paper describing GFS, the scalable distributed file system that powered Google\'s early infrastructure.',
            es: 'El paper de 2003 que describe GFS, el sistema de archivos distribuido escalable que impulsó la infraestructura inicial de Google.'
        },
        category: {
            en: 'Distributed Systems',
            es: 'Sistemas Distribuidos'
        }
    },
    {
        id: 'saltzer-schroeder-protection',
        filename: 'paper - The Protection of Information in Computer Systems.pdf',
        path: '/docs/files/paper - The Protection of Information in Computer Systems.pdf',
        type: 'paper',
        image: saltzerSchroederProtection.src,
        title: {
            en: 'The Protection of Information in Computer Systems',
            es: 'La protección de la información en sistemas informáticos'
        },
        description: {
            en: 'Founded the principles of information security.',
            es: 'Fundó los principios de la seguridad de la información.'
        },
        detailedDescription: {
            en: 'The 1975 paper that established the design principles for secure systems.',
            es: 'El paper de 1975 que estableció los principios de diseño para sistemas seguros.'
        },
        category: {
            en: 'Cybersecurity',
            es: 'Ciberseguridad'
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
            en: 'Practical guide on metrics and KPIs for tech ROI.',
            es: 'Guía práctica sobre métricas y KPIs para ROI tecnológico.'
        },
        detailedDescription: {
            en: 'Presentation covering metrics and indicators for measuring return on investment.',
            es: 'Presentación que cubre métricas e indicadores para medir el retorno de inversión.'
        },
        category: {
            en: 'Business Intelligence',
            es: 'Inteligencia de Negocios'
        }
    }
];

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
