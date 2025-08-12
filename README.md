# Sistema de Gestão de Serviços - Pianificazione

Sistema de gerenciamento de serviços com interface Kanban, desenvolvido em React, permitindo o acompanhamento e controle de serviços em diferentes estágios de produção.

## 🚀 Funcionalidades

- **Quadro Kanban**: Visualização e gerenciamento de serviços em diferentes estágios

  - Esperando Início
  - Em Produção
  - Em Transporte
  - Finalizado

- **Gestão de Cards**:

  - Identificador único automático (PROT-XXX)
  - Sistema de prioridades (Alta, Média, Baixa)
  - Contador de dias em aberto
  - Comentários formatados
  - Histórico de alterações
  - Upload de arquivos e imagens

- **Interações**:
  - Drag and Drop entre colunas
  - Edição de cards existentes
  - Sistema de cores para prioridades
  - Interface responsiva

## 🛠️ Instalação e Configuração

Após clonar o repositório, siga estes passos para configurar o projeto:

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm start
```

O aplicativo será aberto automaticamente no seu navegador padrão no endereço `http://localhost:3000`.

### Comandos Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção do projeto
- `npm test`: Executa os testes do projeto
