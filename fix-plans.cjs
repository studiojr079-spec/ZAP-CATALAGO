const fs = require('fs');
let code = fs.readFileSync('src/lib/initialData.ts', 'utf8');

const targetPlans = `export const PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'Gratuito',
    price: 0,
    billing: 'mensal',
    limits: { products: 5, categories: 2, banners: 1, storageMb: 10 },
    features: ['Até 5 produtos', 'Até 2 categorias', '1 Banner promocional', 'WhatsApp integrado', 'Tema Padrão']
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    price: 49.90,
    billing: 'mensal',
    limits: { products: 30, categories: 5, banners: 3, storageMb: 100 },
    features: ['Até 30 produtos', 'Até 5 categorias', '3 Banners rotativos', 'Analytics Simplificado', 'Suporte via Chat']
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    price: 89.90,
    billing: 'mensal',
    limits: { products: 150, categories: 15, banners: 5, storageMb: 500 },
    features: ['Até 150 produtos', 'Até 15 categorias', '5 Banners rotativos', 'Analytics Completo com Gráficos', 'Personalização Avançada de Cores e Fontes', 'Suporte Prioritário']
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    price: 149.90,
    billing: 'mensal',
    limits: { products: 9999, categories: 99, banners: 10, storageMb: 2048 },
    features: ['Produtos Ilimitados', 'Categorias Ilimitadas', 'Até 10 Banners rotativos', 'SaaS Multi-loja Completo', 'Domínio Personalizado', 'Suporte Premium 24h', 'Sem Taxas sobre Pedidos']
  }
];`;

const newPlans = `export const PLANS: Plan[] = [
  {
    id: 'plan_pro',
    name: 'Pro',
    price: 47.00,
    billing: 'mensal',
    limits: { products: 9999, categories: 999, banners: 10, storageMb: 2048 },
    features: ['Produtos Ilimitados', 'Categorias Ilimitadas', 'Até 10 Banners rotativos', 'SaaS Multi-loja Completo', 'Configurações Avançadas', 'Suporte Premium']
  }
];`;

code = code.replace(targetPlans, newPlans);
fs.writeFileSync('src/lib/initialData.ts', code);
