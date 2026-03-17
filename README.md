# 📊 Incell - Dashboard Excel Interativo

<div align="center">

![Incell Badge](https://img.shields.io/badge/Incell-Dashboard%20Excel-6366f1?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff?style=flat-square&logo=vite)

**Incell** é uma aplicação web moderna e responsiva para visualizar, analisar e exportar dados de arquivos Excel com gráficos configuráveis, tabelas dinâmicas e suporte a dark mode.

[🌐 Demo](https://seu-usuario.github.io/incell) • [📖 Documentação](#-documentação) • [🚀 Começar](#-início-rápido)

</div>

---

## ✨ Principais Funcionalidades

### 📤 Upload e Processamento
- **Drag-and-drop** nativo com validação de arquivo (máx. 15 MB)
- Suporte para **Excel (.xlsx, .xls)** e **CSV**
- Prévia automática dos dados antes de prosseguir
- Detecção inteligente de cabeçalhos e tipos de dados

### 📊 Visualizações Avançadas
- **5 tipos de gráfico**: Barras, Linhas, Área, Pizza, Dispersão (via Recharts)
- Até **6 gráficos simultâneos** configuráveis por dashboard
- Seleção dinâmica de eixos X e Y para cada gráfico
- Grid responsivo com layout adaptativo

### 🗃️ Tabela Dinâmica Profissional
- Filtragem global em tempo real
- Filtros individuais por coluna
- Ordenação multi-coluna
- Paginação customizável
- Integrada com [TanStack React Table v8](https://tanstack.com/table/latest)

### 🌙 Tema Visual Moderno
- **Dark Mode completo** com detecção automática de preferência do sistema
- Paleta de cores customizável via Tailwind v4
- Animações suaves e feedback visual

### 📥 Exportação Versátil
- **Excel (.xlsx)** — tabela completa com formatação
- **CSV** — dados estruturados para importação
- **PDF** — dashboard inteiro (todos os gráficos + tabela)
- **PNG** — cada gráfico individualmente
- Exportação em massa com um clique

### 🚀 Performance e Deployment
- **100% estático** — sem backend, sem servidor
- Otimizado para **GitHub Pages** (ou qualquer host estático)
- **Build rápido** com Vite (< 1s em dev)
- Zero dependências de terceiros para lógica crítica

### 📱 Responsividade
- Mobile-first design
- Funcional em tablets e desktops
- Toque-friendly no mobile

---

## 🎯 Use Cases

- 📊 **Análise de Dados**: Importar planilhas e visualizar tendências
- 📈 **Relatórios Executivos**: Gerar dashboards personalizados rapidamente
- 💼 **Business Intelligence**: Explorar dados com gráficos interativos
- 🎓 **Educação**: Ferramenta para ensino de análise de dados
- 🔍 **Data Exploration**: Investigar grandes datasets sem ferramentas caras

---

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js 18+** ([download](https://nodejs.org))
- **npm 9+** (incluído com Node.js)
- Git (opcional)

### 1️⃣ Clonar ou Extrair

```bash
# Via Git
git clone https://github.com/seu-usuario/incell.git
cd incell

# Ou extrair o ZIP
unzip incell.zip
cd incell
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Rodar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 4️⃣ Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados em `/dist`

### 5️⃣ Preview do Build

```bash
npm run preview
```

---

## 🌐 Deploy no GitHub Pages

### ⚡ Opção 1: GitHub Actions (Recomendado — Automático)

**Passo 1:** Configure o repositório
```bash
# Se ainda não tem git init
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/incell.git
git push -u origin main
```

**Passo 2:** Ative GitHub Pages no repositório
1. Vá em **Settings** → **Pages**
2. Em "Source", selecione **GitHub Actions**

**Passo 3:** Aguarde a automação
- O workflow em `.github/workflows/deploy.yml` executa automaticamente
- Em ~2 minutos, sua aplicação estará online em:
  ```
  https://seu-usuario.github.io/incell/
  ```

✅ **A vantagem:** Deploy automático a cada push para `main`

---

### 📦 Opção 2: Deploy Manual com gh-pages

Se preferir controle manual:

```bash
# Instale gh-pages globalmente (uma única vez)
npm install -g gh-pages

# Build + Deploy
npm run build
npx gh-pages -d dist
```

Após 1-2 minutos, acesse:
```
https://seu-usuario.github.io/incell/
```

---

### ⚙️ Configurar para Outro Nome de Repositório

Se clonar este projeto com um nome diferente, atualize:

**`vite.config.ts`**
```ts
base: '/seu-novo-nome-repo/',
```

**Exemplos:**
```ts
base: '/dashboard/',              // → seu-usuario.github.io/dashboard/
base: '/excel-viewer/',           // → seu-usuario.github.io/excel-viewer/
base: '/incell/',                 // → seu-usuario.github.io/incell/ (padrão)
```

---

## 📂 Estrutura do Projeto

```
incell/
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions CI/CD
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx             # Grid responsivo de gráficos
│   │   ├── UploadExcel.tsx           # Tela de upload com drag-and-drop
│   │   ├── ChartConfig.tsx           # Configuração e gerenciamento de gráficos
│   │   ├── DynamicTable.tsx          # Tabela avançada com filtros
│   │   ├── ExportButtons.tsx         # Botões de exportação (PDF/Excel/CSV/PNG)
│   │   └── ThemeToggle.tsx           # Toggle dark/light mode
│   ├── store/
│   │   └── useDashboardStore.ts      # Gerenciamento de estado (Zustand)
│   ├── lib/
│   │   ├── excel.ts                  # Parsing, validação e export de Excel
│   │   └── pdfExport.ts              # Exportação de PDF com html2canvas
│   ├── App.tsx                       # Componente raiz e layout principal
│   ├── main.tsx                      # Entry point React 19
│   └── index.css                     # Estilos globais + Tailwind v4
├── index.html                        # HTML raiz
├── vite.config.ts                    # Configuração Vite
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependências e scripts
└── README.md                         # Este arquivo
```

---

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Vite** | 6.3.5 | Build tool ultrarrápido |
| **React** | 19.1.0 | UI library moderna |
| **TypeScript** | 5.8.3 | Type safety |
| **Tailwind CSS** | 4.1.6 | Utility-first styling |
| **Recharts** | 2.15.3 | Gráficos compostos |
| **TanStack React Table** | 8.21.3 | Tabelas avançadas |
| **SheetJS (xlsx)** | 0.18.5 | Parsing de Excel |
| **jsPDF** | 2.5.2 | Exportação PDF |
| **html2canvas** | 1.4.1 | Renderização de elementos em imagem |
| **Zustand** | 5.0.5 | Gerenciamento de estado |
| **Lucide React** | 0.511.0 | Ícones SVG |
| **gh-pages** | 6.0.0 | Deploy para GitHub Pages |

---

## 🎨 Customização

### Mudar Cores da Paleta

Edite em `src/index.css`:

```css
@theme {
  --color-brand-500: #6366f1;      /* Cor primária */
  --color-brand-600: #4f46e5;      /* Hover/Active */
  --color-brand-700: #4338ca;      /* Dark */
  --color-brand-50: #f2f5ff;       /* Light background */
}
```

Cores recomendadas:
- **Indigo** (padrão): `#6366f1`
- **Blue**: `#3b82f6`
- **Purple**: `#a855f7`
- **Green**: `#10b981`
- **Orange**: `#f97316`

### Adicionar Novos Tipos de Gráfico

**1. Edite `src/components/ChartConfig.tsx`:**
```ts
const CHART_TYPES = [
  // ... existentes ...
  { value: 'scatter', label: 'Dispersão' },
  { value: 'seu-novo-tipo', label: 'Seu Nome' }, // ← NOVO
]
```

**2. Edite `src/components/Dashboard.tsx`:**
```ts
case 'seu-novo-tipo':
  return (
    <SeuGraficoCustomizado data={data} xAxis={xAxis} yAxis={yAxis} />
  );
```

### Alterar Tamanho Máximo de Upload

Em `src/components/UploadExcel.tsx`:

```ts
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB → mude para o valor desejado
```

---

## 🐛 Solução de Problemas

### ❌ "Cannot read properties of undefined" no upload

**Solução:** Seu Excel precisa ter cabeçalho (nomes de coluna) na **primeira linha**.

**Exemplo correto:**
| Nome | Idade | Salário |
|------|-------|---------|
| João | 28 | 5000 |
| Maria | 32 | 6000 |

### ❌ Gráfico de Pizza vazio

**Solução:** A coluna Y deve conter números. Gráficos de pizza usam:
- X-axis: Categorias (texto)
- Y-axis: Valores (numéricos)

### ❌ PDF exportado em branco ou cortado

**Solução:** Role a página para o topo antes de exportar:
```js
window.scrollTo(0, 0);
// depois exporte
```

Ou clique em "Exportar PDF" direto (a app faz scroll automático).

### ❌ GitHub Pages retorna 404

**Solução:** Confirme que `base` em `vite.config.ts` bate **exatamente** com o nome do repo:

```ts
// Se seu repo é "incell"
base: '/incell/',

// Se é "meu-dashboard"
base: '/meu-dashboard/',
```

(Diferencia maiúsculas/minúsculas)

### ❌ Erro de network ao fazer deploy

**Solução:** Confirme que:
1. ✅ Você tem acesso ao repositório
2. ✅ GitHub Actions está habilitado (Settings → Actions)
3. ✅ O branch padrão é `main`
4. ✅ Pages está configurado para "GitHub Actions"

---

## 📊 Exemplos de Uso

### Exemplo 1: Analisar Vendas Mensais

1. Crie um Excel com colunas: `Mês`, `Vendas`, `Lucro`
2. Upload via Incell
3. Crie 2 gráficos:
   - **Gráfico 1 (Linhas)**: Mês vs Vendas
   - **Gráfico 2 (Barras)**: Mês vs Lucro
4. Exporte como PDF para apresentação

### Exemplo 2: Dashboard de Atendimento

1. Importe base de atendimentos com: `Data`, `Categoria`, `Duração (min)`, `Satisfação`
2. Crie gráficos:
   - Pizza: Distribuição por Categoria
   - Barras: Duração média por Categoria
   - Linha: Satisfação ao longo do tempo
3. Use filtros da tabela para drill-down por período

---

## 🚀 Performance

- **Build time**: ~1 segundo (Vite)
- **App size**: ~180 KB (gzipped)
- **TTFB**: < 100 ms
- **FCP**: < 1 segundo
- **LCP**: < 2 segundos

---

## 📝 Licença

MIT — Uso livre para projetos pessoais e comerciais.

```
MIT License

Copyright (c) 2024 Incell Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Contribuição

Tem ideias para melhorias? Abra uma issue ou pull request!

**Como contribuir:**
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

- 📖 Veja a [documentação oficial do Vite](https://vite.dev)
- 💬 Abra uma [discussão no GitHub](https://github.com/seu-usuario/incell/discussions)
- 🐛 Reporte bugs via [Issues](https://github.com/seu-usuario/incell/issues)

---

## 🎯 Roadmap

- [ ] Suporte a múltiplos sheets do Excel
- [ ] Análise estatística (média, desvio padrão, etc)
- [ ] Integração com Google Sheets
- [ ] Temas pré-definidos (Cyberpunk, Pastel, etc)
- [ ] Modo colaborativo (compartilhar dashboards)
- [ ] Cache offline com Service Workers
- [ ] Importação de dados via URL/API

---

<div align="center">

**Feito com ❤️ usando React + Vite**

[⭐ Dê uma estrela se foi útil!](https://github.com/seu-usuario/incell)

</div>
