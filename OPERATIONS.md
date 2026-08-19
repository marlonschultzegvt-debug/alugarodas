# Operação do Aluga Rodas

## Arquitetura de hospedagem

O frontend e o servidor do Aluga Rodas são publicados pelo hosting gerenciado do Manus. O ambiente atual é o subdomínio `alugarodas-jp8f2bzz.manus.space`; o domínio `alugarodas.com.br` permanece reservado para uma etapa posterior no painel de hospedagem. O build é produzido por Vite e o servidor Node/Express é empacotado para execução compatível com o ambiente gerenciado.

## Banco de dados

A produção atual permanece usando a conexão integrada já configurada. O TiDB Cloud Starter foi preparado como staging MySQL-compatible, com TLS, schema de autenticação e entidades de marketplace validados por testes somente leitura e transações com rollback. A promoção exige cadastrar a URI TiDB no segredo seguro `DATABASE_URL`, executar a migração/schema final e só então ativar `VITE_MARKETPLACE_API_ENABLED`. A URI nunca deve ser colocada no código, em commits ou no chat.

## Armazenamento

Arquivos estáticos e imagens do produto usam referências de storage S3/Manus Storage, mantendo bytes fora do banco e fora do diretório de deploy. O banco deve armazenar apenas metadados e referências, como URL e `storageKey`. Uploads de usuários, quando ativados, devem passar pelos helpers server-side de storage, com autorização e validação de MIME/tamanho.

## Segurança operacional

Sessões são controladas pelo OAuth seguro e por cookie; papéis são verificados server-side. O painel `/adm` aceita apenas Admin. Dados privados de login, dashboard e leads não entram no cache público da PWA. Antes de promover o TiDB, deve-se confirmar rotação de credenciais, aplicar migrações não destrutivas e executar a suíte Vitest completa.

## Checklist de publicação

A sequência recomendada é: validar o build e os testes; confirmar variáveis e secrets no painel; aplicar schema no TiDB; executar probes de conexão; ativar a flag do marketplace; publicar checkpoint; testar busca, detalhe, anúncio e lead; revisar logs; e somente depois associar o domínio customizado, preservando MX, SPF e DKIM do Zoho.
