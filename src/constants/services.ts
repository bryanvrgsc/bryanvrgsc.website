import type { Service } from '../types';

export const SERVICES: Record<'en' | 'es', Service[]> = {
    en: [
        {
            title: "App Development",
            description: "High-performance native and cross-platform mobile applications focused on user experience and technical robustness.",
            iconName: "Smartphone",
            items: ["iOS Apps (SwiftUI, Combine)", "Flutter Apps (iOS/Android)", "Web Apps & APIs", "Integrations (Auth0, Firebase)"],
            valueProp: ["Digitize processes", "Reduce operating costs", "Solid & scalable apps"]
        },
        {
            title: "Cloud & DevOps",
            description: "Scalable cloud architecture and automated deployment pipelines to ensure maximum availability and security.",
            iconName: "Cloud",
            items: ["Cloud Infrastructure (AWS / GCP / Azure)", "Serverless Backend & Containers", "CI/CD with GitHub Actions", "Cloud Databases (SQL/NoSQL)", "Cloud Cost Optimization"],
            valueProp: ["High availability", "Automated deployments", "Scalability"]
        },
        {
            title: "Business Intelligence",
            description: "Transforming raw data into strategic insights through advanced analytics and high-impact visualization models.",
            iconName: "ChartBar",
            items: ["Interactive Dashboards", "KPI Reporting Models", "Report Automation", "Data Consulting"],
            valueProp: ["Data-driven decisions", "Key metric clarity", "Alerts & predictive analysis"]
        },
        {
            title: "Tech Consulting",
            description: "Strategic guidance on architecture, security, and digital transformation to build long-term sustainable products.",
            iconName: "ShieldCheck",
            items: ["Architecture Assessment", "App Optimization", "Tech Migration", "Security & Auth"],
            valueProp: ["Avoid costly mistakes", "Reliable systems", "Guaranteed scalability"]
        },
        {
            title: "Networks & Connectivity",
            description: "Advanced networking solutions for high-demand environments, ensuring seamless connectivity and IoT integration.",
            iconName: "Wifi",
            items: ["Residential/Business Wi-Fi Optimization", "Mesh Network Design", "IoT Device Integration", "Network Performance Diagnostic"],
            valueProp: ["Stable connection", "Full coverage", "Secure ecosystem"]
        },
        {
            title: "Artificial Intelligence",
            description: "Implementation of advanced machine learning models and neural networks to automate complex processes and generate predictive intelligence.",
            iconName: "Cpu",
            items: ["Custom LLM Integration", "Predictive Analytics Models", "Computer Vision Solutions", "Process Automation (RPA)"],
            valueProp: ["Operational automation", "Predictive insights", "Competitive advantage"]
        }
    ],
    es: [
        {
            title: "Desarrollo de Apps",
            description: "Aplicaciones móviles nativas y multiplataforma de alto rendimiento, centradas en la experiencia del usuario y la robustez técnica.",
            iconName: "Smartphone",
            items: ["Apps iOS (SwiftUI, Combine)", "Apps Flutter (iOS/Android)", "Web Apps y APIs", "Integraciones (Auth0, Firebase)"],
            valueProp: ["Digitalizar procesos", "Reducir costos operativos", "Apps sólidas y escalables"]
        },
        {
            title: "Cloud & DevOps",
            description: "Arquitectura en la nube escalable y pipelines de despliegue automatizados para garantizar la máxima disponibilidad y seguridad.",
            iconName: "Cloud",
            items: ["Infraestructura en la nube (AWS / GCP / Azure)", "Backend serverless y contenedores", "CI/CD con GitHub Actions", "Bases de datos en la nube (SQL/NoSQL)", "Optimización de costos en nube"],
            valueProp: ["Alta disponibilidad", "Despliegues automatizados", "Escalabilidad"]
        },
        {
            title: "Business Intelligence",
            description: "Transformación de datos crudos en información estratégica mediante análisis avanzado y modelos de visualización de alto impacto.",
            iconName: "ChartBar",
            items: ["Dashboards interactivos", "Modelos de reporte para KPI's", "Automatización de reportes", "Consultoría de datos"],
            valueProp: ["Decisiones basadas en datos", "Claridad en indicadores clave", "Alertas y análisis predictivo"]
        },
        {
            title: "Consultoría Tecnológica",
            description: "Asesoría estratégica en arquitectura, seguridad y transformación digital para construir productos sostenibles a largo plazo.",
            iconName: "ShieldCheck",
            items: ["Evaluación de arquitectura", "Optimización de apps", "Migración tecnológica", "Seguridad y autenticación"],
            valueProp: ["Evitar errores costosos", "Sistemas confiables", "Escalabilidad garantizada"]
        },
        {
            title: "Redes y Conectividad",
            description: "Soluciones de redes avanzadas para entornos de alta demanda, garantizando conectividad total e integración de IoT.",
            iconName: "Wifi",
            items: ["Optimización de Wi-Fi residencial/empresarial", "Diseño de redes Mesh", "Integración de dispositivos IoT", "Diagnóstico de rendimiento de red"],
            valueProp: ["Conexión estable", "Cobertura total", "Ecosistema seguro"]
        },
        {
            title: "Inteligencia Artificial",
            description: "Implementación de modelos avanzados de machine learning y redes neuronales para automatizar procesos complejos y generar inteligencia predictiva.",
            iconName: "Cpu",
            items: ["Integración de LLMs personalizados", "Modelos de análisis predictivo", "Soluciones de visión artificial", "Automatización de procesos (RPA)"],
            valueProp: ["Automatización operativa", "Insights predictivos", "Ventaja competitiva"]
        }
    ]
};
