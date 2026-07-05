# Guia de Deploy na Hostinger (Node.js)

Este projeto é uma aplicação full-stack (React + Express). Para rodar na Hostinger, você precisa realizar o build da aplicação antes de enviá-la.

## 1. Preparação Local (Build)

Antes de enviar os arquivos para o servidor, gere a versão de produção:

1. No seu terminal local, execute:
   ```bash
   npm run build
   ```
2. Isso criará uma pasta chamada `dist/` na raiz do seu projeto. Esta pasta contém todos os arquivos estáticos e o servidor compilado (`dist/server.cjs`).

## 2. Envio de Arquivos (SFTP)

1. Conecte-se ao seu servidor via SFTP (usando FileZilla ou similar).
2. Transfira **apenas** os seguintes arquivos/pastas para o diretório de destino no servidor:
   - `dist/` (pasta inteira)
   - `package.json`
   - `package-lock.json` (ou `yarn.lock`)
   - `.env.example` (apenas para referência)

## 3. Configuração no Servidor

1. Acesse o terminal do seu servidor via SSH.
2. Navegue até a pasta onde você enviou os arquivos.
3. Instale apenas as dependências de produção:
   ```bash
   npm install --omit=dev
   ```

## 4. Configuração de Variáveis de Ambiente

No painel da Hostinger (hPanel) ou via terminal:
- Configure as variáveis de ambiente necessárias para o projeto (ex: `APP_URL`, `PORT`, `NODE_ENV`).
- **Nota:** A Hostinger geralmente fornece uma interface para configurar variáveis de ambiente no menu de gerenciamento do aplicativo Node.js.

## 5. Iniciando o Servidor com PM2 (Recomendado)

Para garantir que sua aplicação continue rodando mesmo após fechar o terminal, utilize o **PM2**:

1. Instale o PM2 globalmente:
   ```bash
   npm install -g pm2
   ```
2. Inicie a aplicação:
   ```bash
   pm2 start dist/server.cjs --name "meu-app"
   ```
3. Garanta que o PM2 inicie no boot do servidor:
   ```bash
   pm2 save
   pm2 startup
   ```
