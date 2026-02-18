import type { UIText } from '../types';

export const UI_TEXT: Record<'en' | 'es', UIText> = {
    en: {
        homeLabels: {
            overview: "Overview",
            collaboration: "Collaboration",
            future: "Future",
            values: "Values"
        },
        heroTitle: "Arquitectos del Futuro.",
        heroSubtitle: "Ingeniería de vanguardia para la próxima generación de productos digitales.",
        heroTags: "Apps • Cloud • Business Intelligence",
        startProject: "Iniciar Proyecto",
        exploreWork: "Ver Portafolio",
        stats: {
            latency: "Latency",
            uptime: "Uptime",
            security: "Security",
            global: "Global"
        },
        mission: {
            title: "Mission",
            content: "Develop innovative technological solutions that drive efficiency, business intelligence, and strategic decision-making for our clients, through custom software, data analysis, and high-impact digital platforms."
        },
        vision: {
            title: "Vision",
            content: "To become a leading company in digital solutions and advanced analytics in Latin America, recognized for transforming data into value, optimizing processes, and creating technological products that drive sustainable growth for our clients."
        },
        values: {
            title: "Values",
            content: "Integrity in every project, excellence in engineering, and a constant commitment to innovation. We believe in transparency, technical rigor, and creating products that transcend, always putting ethics and professional quality first."
        },
        services: {
            title: "Services",
            subtitle: "High-performance engineering solutions.",
            impact: "Impact",
            engagementModels: "Engagement Models"
        },
        portfolio: {
            title: "Portfolio",
            subtitle: "Selected works and case studies.",
            result: "Result",
            challenge: "Challenge",
            solution: "Solution",
            viewDetails: "View Details",
            modal: {
                caseStudy: "Case Study",
                overview: "Overview",
                presentation: "Presentation / Slides",
                demoVideo: "Demo Video",
                watchDemo: "Watch Demo Video",
                externalLink: "External Link",
                features: "Features",
                techStack: "Key Packages",
                documentation: "Documentation",
                roadmap: "Roadmap",
                viewRepo: "View Repository",
                openTab: "Open in new tab",
                downloadPdf: "Download PDF",
                pdfError: "PDF viewing not supported."
            }
        },
        resources: {
            title: "Resources",
            subtitle: "Strategic thinking and tech deep dives.",
            searchPlaceholder: "Search documents...",
            allCategories: "All Categories",
            allDocuments: "All Documents",
            papers: "Papers",
            slides: "Slides",
            noResults: "No documents found matching your search."
        },
        contact: {
            title: "Let's talk business.",
            subtitle: "Schedule a strategic 30-minute call. We'll analyze your current architecture and growth opportunities.",
            successTitle: "Message Received.",
            successMessage: "Thank you for reaching out, {name}. We'll analyze your request and get back to you within 2 hours.",
            sendAnother: "Send another message",
            placeholders: {
                name: "Name / Company",
                email: "Email",
                phone: "Phone number",
                message: "Tell us about your project...",
                budget: "Estimated budget"
            },
            button: {
                default: "Schedule Call",
                sending: "Sending...",
            },
            responseTime: "Average response time: 2 hours.",
            errors: {
                name: "Please enter your name.",
                email: "Please enter a valid email address.",
                message: "Please tell us about your project.",
                network: "Network error. Please try again.",
                generic: "Something went wrong. Please try again."
            }
        },
        nav: {
            home: "Home",
            services: "Services",
            work: "Work",
            resources: "Resources",
            contact: "Contact"
        }
    },
    es: {
        homeLabels: {
            overview: "Resumen",
            collaboration: "Colaboración",
            future: "Futuro",
            values: "Valores"
        },
        heroTitle: "Arquitectos del Futuro.",
        heroSubtitle: "Ingeniería de vanguardia para la próxima generación de productos digitales.",
        heroTags: "Apps • Cloud • Business Intelligence",
        startProject: "Iniciar Proyecto",
        exploreWork: "Ver Portafolio",
        stats: {
            latency: "Latencia",
            uptime: "Uptime",
            security: "Seguridad",
            global: "Global"
        },
        mission: {
            title: "Misión",
            content: "Desarrollar soluciones tecnológicas innovadoras que impulsen la eficiencia, la inteligencia empresarial y la toma de decisiones estratégicas de nuestros clientes, mediante software a la medida, análisis de datos y plataformas digitales de alto impacto."
        },
        vision: {
            title: "Visión",
            content: "Convertirnos en una empresa líder en soluciones digitales y analítica avanzada en Latinoamérica, reconocida por transformar datos en valor, optimizar procesos y crear productos tecnológicos que impulsen el crecimiento sostenible de nuestros clientes."
        },
        values: {
            title: "Valores",
            content: "Integridad en cada proyecto, excelencia en ingeniería y un compromiso constante con la innovación. Creemos en la transparencia, el rigor técnico y la creación de productos que trasciendan, anteponiendo siempre la ética y la calidad profesional."
        },
        services: {
            title: "Servicios",
            subtitle: "Soluciones de ingeniería de alto rendimiento.",
            impact: "Impacto",
            engagementModels: "Modelos de Trabajo"
        },
        portfolio: {
            title: "Portafolio",
            subtitle: "Trabajos seleccionados y casos de estudio.",
            result: "Resultado",
            challenge: "Desafío",
            solution: "Solución",
            viewDetails: "Ver Detalles",
            modal: {
                caseStudy: "Caso de Estudio",
                overview: "Resumen",
                presentation: "Presentación / Diapositivas",
                demoVideo: "Video Demo",
                watchDemo: "Ver Video Demo",
                externalLink: "Enlace Externo",
                features: "Funcionalidades",
                techStack: "Paquetes Clave",
                documentation: "Documentación",
                roadmap: "Próximos Pasos",
                viewRepo: "Ver Repositorio",
                openTab: "Abrir en nueva pestaña",
                downloadPdf: "Descargar PDF",
                pdfError: "Visualización de PDF no soportada."
            }
        },
        resources: {
            title: "Recursos",
            subtitle: "Pensamiento estratégico y tecnología profunda.",
            searchPlaceholder: "Buscar documentos...",
            allCategories: "Todos los Temas",
            allDocuments: "Todos los Documentos",
            papers: "Artículos",
            slides: "Presentaciones",
            noResults: "No se encontraron documentos que coincidan con tu búsqueda."
        },
        contact: {
            title: "Hablemos de negocios.",
            subtitle: "Agenda una llamada estratégica de 30 minutos. Analizaremos tu arquitectura actual y oportunidades de crecimiento.",
            successTitle: "Mensaje Recibido.",
            successMessage: "Gracias por contactarnos, {name}. Analizaremos tu solicitud y te responderemos en menos de 2 horas.",
            sendAnother: "Enviar otro mensaje",
            placeholders: {
                name: "Nombre / Empresa",
                email: "Correo electrónico",
                phone: "Número de teléfono",
                message: "Cuéntanos sobre tu proyecto...",
                budget: "Presupuesto estimado"
            },
            button: {
                default: "Agendar Llamada",
                sending: "Enviando...",
            },
            responseTime: "Tiempo de respuesta promedio: 2 horas.",
            errors: {
                name: "Por favor ingresa tu nombre.",
                email: "Por favor ingresa un correo válido.",
                message: "Por favor cuéntanos sobre tu proyecto.",
                network: "Error de red. Intenta de nuevo.",
                generic: "Algo salió mal. Intenta de nuevo."
            }
        },
        nav: {
            home: "Inicio",
            services: "Servicios",
            work: "Portafolio",
            resources: "Recursos",
            contact: "Contacto"
        }
    }
};
