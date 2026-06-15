# 🏢 EducaSync

> Sistema Inteligente de Gestão de Ativos, Salas e Locações Escolares.

O **EducaSync** é uma plataforma web moderna desenvolvida para centralizar, organizar e monitorar o uso de infraestrutura e recursos pedagógicos em instituições de ensino. O sistema resolve o problema de conflitos de horários em reservas de salas e laboratórios, gerencia a manutenção de ativos (como computadores, projetores e ar-condicionado) e fornece visibilidade total para gestores de múltiplas unidades (escolas/polos).



![Laravel Version](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=flat-square&logo=laravel&logoColor=white)
![React Version](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=flat-square&logo=mysql&logoColor=white)


---

## 🚀 Funcionalidades Principais

### 👤 Níveis de Acesso Dinâmicos (RBAC)
* **SuperAdmin (Administrador Global):** Possui visão macro de todas as unidades escolares do município/rede. Pode criar novas escolas, gerenciar usuários, auditar salas e aplicar filtros globais para alternar entre as unidades de forma fluida.
* **Gestor de Unidade (Admin Local):** Tem acesso restrito e focado estritamente nas salas, turmas e ativos da sua própria escola. O sistema bloqueia e oculta dados de outras sedes por questões de segurança e privacidade.
* **Professor / Funcionário:** Interface simplificada para consulta de disponibilidade de salas e agendamento de recursos para aulas e atividades pedagógicas.

### 🏫 Gestão de Infraestrutura e Ativos
* Visualização em tempo real do status de cada sala (Bloco, Nome, Capacidade).
* Filtros inteligentes por hardware específico: quantidade de computadores funcionais, presença de ar-condicionado e projetores operacionais.
* Controle relacional de agendamentos (`prox` registros de locação), exibindo dinamicamente qual professor realizou a reserva do espaço para evitar duplicidade.

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando o padrão de arquitetura **SPA (Single Page Application)** moderno, eliminando carregamentos lentos de página e entregando uma experiência nativa de aplicativo.

* **Back-end:** [Laravel 10/11](https://laravel.com/) (PHP) - Motor robusto para API, ORM (Eloquent), Segurança e Regras de Negócio.
* **Front-end:** [React.js](https://react.dev/) - Biblioteca componentizada para interfaces reativas e performáticas.
* **Ponte de Comunicação:** [Inertia.js](https://inertiajs.com/) - Camada que une o Laravel ao React sem a necessidade de criar APIs REST complexas do zero, mantendo o roteamento controlado pelo back-end.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) - Framework utilitário utilitário para design responsivo e Dark Mode nativo.
* **Banco de Dados:** MySQL - Modelo relacional para integr

* ## 📐 Arquitetura e Estrutura de Pastas

O projeto adota o padrão **MVC (Model-View-Controller)** adaptado para o ecossistema Inertia.js:

```text
educasync/
├── app/
│   ├── Http/
│   │   └── Controllers/     # Controladores (Regras de negócio, filtros e Eager Loading)
│   └── Models/              # Modelos Relacionais Eloquent (Sala, Unidade, Agendamento, User)
├── database/
│   └── migrations/          # Estrutura de criação e versionamento do banco de dados
├── resources/
│   └── js/
│       ├── Components/      # Componentes React reutilizáveis (Inputs, Cards, Modais)
│       ├── Layouts/         # Estruturas de página (Autenticado, Visitante)
│       └── Pages/           # Telas da Aplicação (Welcome.jsx, Salas/Index.jsx)
└── public/
    └── images/              # Ativos estáticos e mídias de interface (Backgrounds, Favicons)
````

---
## Autor

- [@Arthur-Cardoso-de-jesus](https://github.com/Arthur-Cardoso-de-Jesus)
