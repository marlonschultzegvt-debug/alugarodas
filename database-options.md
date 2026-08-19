# Comparação de banco para o Aluga Rodas

## Recomendação

Manter o banco integrado ao projeto Manus para o MVP é a opção de menor risco, pois o projeto já usa MySQL/TiDB, `mysql2`, Drizzle e autenticação full-stack. Não é necessário criar uma conta externa para começar.

Se o proprietário quiser um banco gratuito externo, a melhor compatibilidade é o TiDB Cloud Starter, que é MySQL-compatible e oferece quota gratuita documentada. Isso reduz a migração em relação a Supabase ou Neon, ambos baseados em PostgreSQL.

## Comparação

| Opção | Compatibilidade com o código atual | Pontos fortes | Risco/custo de migração |
|---|---|---|---|
| Manus/MySQL-TiDB integrado | Alta | Já conectado ao projeto e à publicação | Menor risco; depende da operação Manus |
| TiDB Cloud Starter | Alta | MySQL-compatible, quota gratuita, escalabilidade | Exige nova conta, DATABASE_URL, TLS e migração |
| Supabase Free | Baixa/média | PostgreSQL, Auth, Storage e APIs integradas | Exige migrar schema, queries e possivelmente auth/storage; projetos gratuitos podem pausar após inatividade |
| Neon Free | Média | PostgreSQL serverless, escala a zero, sem cartão no plano Free | Não substitui sozinho auth/storage; exige migração de MySQL para PostgreSQL |

## Fontes consultadas

1. Supabase Pricing: https://supabase.com/pricing
2. Neon Pricing: https://neon.com/pricing
3. TiDB Cloud Select Cluster Tier: https://docs.pingcap.com/tidbcloud/select-cluster-tier/

## Decisão sugerida

Para publicar rapidamente: manter Manus/MySQL-TiDB integrado. Para uma conta externa gratuita de contingência ou ambiente independente: criar TiDB Cloud Starter, migrar o schema com cuidado, configurar TLS e testar antes de trocar a DATABASE_URL. Não criar Supabase ou Neon sem aceitar a migração para PostgreSQL.
