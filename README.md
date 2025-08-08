# Person Nexus

Sistema de gerenciamento de pessoas desenvolvido como teste técnico para a Stefanini.

## 📋 Sobre o Projeto

Este projeto foi criado como um teste técnico para demonstrar habilidades em desenvolvimento fullstack, aplicando um backend próprio desenvolvido em NestJS. O sistema oferece um CRUD completo para gerenciamento de pessoas com interface moderna e responsiva.

## 🚀 Deploy e Infraestrutura

- **Frontend**: Deploy realizado no [Vercel](https://vercel.com)
- **Backend**: API própria em NestJS
- **DNS**: Rotas configuradas no Route 53 da AWS
- **Domínio**: Configuração de domínio personalizado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Router DOM** - Roteamento client-side
- **React Query (TanStack Query)** - Gerenciamento de estado e cache de dados
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos

### Backend
- **NestJS** - Framework Node.js para APIs
- **JWT** - Autenticação baseada em tokens
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript

### DevOps & Infraestrutura
- **Vercel** - Deploy e hosting do frontend
- **AWS Route 53** - Gerenciamento de DNS
- **Git** - Controle de versão

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema de login com JWT
- Rotas protegidas
- Logout automático em caso de token expirado

### 👥 Gerenciamento de Pessoas
- **Cadastro** de novas pessoas
- **Edição** de dados existentes
- **Exclusão** com confirmação
- **Listagem** com paginação
- **Busca** por nome, CPF ou email
- **Filtros** por sexo, naturalidade e nacionalidade

### 📊 Dashboard
- Estatísticas em tempo real
- Contadores de pessoas cadastradas
- Resultados de busca
- Cadastros do dia

### 🎨 Interface
- **Tema claro/escuro** com toggle
- **Design responsivo** para todos os dispositivos
- **Animações suaves** e transições
- **Feedback visual** para ações do usuário
- **Validação em tempo real** nos formulários

## 🏗️ Arquitetura e Boas Práticas

### 📁 Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Radix UI)
│   ├── auth-provider/  # Contexto de autenticação
│   ├── theme-provider/ # Gerenciamento de tema
│   └── ...
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── hooks/              # Custom hooks
├── utils/              # Utilitários e validações
├── types/              # Definições de tipos TypeScript
└── styles/             # Estilos globais
```

### 🔧 Padrões Implementados

#### **Separação de Responsabilidades**
- Componentes focados em uma única responsabilidade
- Serviços separados para lógica de negócio
- Hooks customizados para lógica reutilizável

#### **TypeScript**
- Tipagem forte em todo o projeto
- Interfaces bem definidas
- Generics para componentes reutilizáveis

#### **React Query**
- Cache inteligente de dados
- Sincronização automática
- Gerenciamento de estado de loading/error
- Debounce para buscas

#### **Validação Robusta**
- Validação client-side em tempo real
- Validação de CPF com algoritmo oficial
- Validação de email com regex
- Validação de datas (não permitir datas futuras)

#### **Acessibilidade**
- ARIA labels e descrições
- Navegação por teclado
- Contraste adequado
- Screen reader friendly

#### **Performance**
- Lazy loading de componentes
- Debounce em inputs de busca
- Otimização de re-renders
- Bundle splitting

#### **UX/UI**
- Feedback visual imediato
- Estados de loading
- Mensagens de erro claras
- Confirmações para ações destrutivas

#### **Segurança**
- Sanitização de inputs
- Validação server-side
- Tokens JWT seguros
- Proteção contra XSS

## 📱 Responsividade

O projeto foi desenvolvido seguindo a metodologia **Mobile First**, garantindo uma experiência otimizada em:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1280px+)

## 🎯 Objetivos Alcançados

- ✅ **CRUD completo** de pessoas
- ✅ **Autenticação segura** com JWT
- ✅ **Interface responsiva** e moderna
- ✅ **Validações robustas** client-side
- ✅ **Performance otimizada**
- ✅ **Acessibilidade** implementada
- ✅ **Deploy automatizado** no Vercel
- ✅ **Configuração de DNS** na AWS

## 👨‍💻 Desenvolvedor

**Lucas Sens** - Desenvolvedor Fullstack

---

*Projeto desenvolvido como teste técnico para a Stefanini*
