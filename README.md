# 🏍️ Trivolts Motors — Curadoria de Motos Elétricas

Ferramenta interna para catalogar motos elétricas durante visitas a fornecedores.

---

## 🚀 Configuração Local

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Acesse: http://localhost:3000

---

## 🐳 Deploy no Easypanel

Configure as variáveis de ambiente no painel do Easypanel:

| Variável | Descrição |
|---|---|
| DATABASE_URL | String de conexão PostgreSQL |
| MINIO_ENDPOINT | Host do servidor MinIO |
| MINIO_PORT | Porta do MinIO (padrão: 9000) |
| MINIO_USE_SSL | true ou false |
| MINIO_ACCESS_KEY | Access Key do MinIO |
| MINIO_SECRET_KEY | Secret Key do MinIO |
| MINIO_BUCKET_NAME | Nome do bucket (ex: trivolts-motos) |

O Dockerfile multi-stage já está configurado e roda `prisma db push` automaticamente no startup.

---

## 📦 Funcionalidades

| Feature | Status |
|---|---|
| Tabela responsiva com busca | ✅ |
| Cadastro com câmera (capture=environment) | ✅ |
| Upload de 2 fotos por moto via MinIO | ✅ |
| Exportar PDF com fotos | ✅ |
| Exportar Excel estilizado | ✅ |
| Toast em PT-BR após salvar | ✅ |
| Redirect automático ao dashboard | ✅ |
| Interface 100% PT-BR | ✅ |
| Mobile-friendly | ✅ |

---

## 🛠️ Stack

- **Framework**: Next.js 14 (App Router)
- **Banco**: PostgreSQL via Prisma ORM
- **Storage**: MinIO S3-compatible
- **UI**: shadcn/ui + Tailwind CSS
- **Exportação**: jspdf, jspdf-autotable, exceljs
- **Deploy**: Docker multi-stage + Easypanel

> Desenvolvido para uso interno da Trivolts Motors.