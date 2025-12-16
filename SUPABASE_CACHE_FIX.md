# Como Resolver o Problema de Cache do PostgREST

## Problema
O erro "Could not find the table 'public.subscriptions' in the schema cache" ocorre quando o PostgREST (API do Supabase) não reconhece tabelas recém-criadas, mesmo que elas existam no banco de dados.

## Solução: Reiniciar o Projeto Supabase

### Passo 1: Acesse o Dashboard do Supabase
1. Vá para https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto `invopay` (ou o nome do seu projeto)

### Passo 2: Reinicie o Projeto
1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **General**
3. Role até a seção **Project Settings**
4. Clique no botão **"Restart project"** ou **"Pause"** e depois **"Resume"**

### Passo 3: Aguarde
- O projeto levará 1-2 minutos para reiniciar
- Você receberá uma notificação quando estiver pronto

### Passo 4: Teste Novamente
1. Recarregue a página da aplicação
2. Tente criar uma subscription novamente
3. Ou clique em "Retry Save to Database" se já tiver uma subscription criada on-chain

## Por que isso funciona?
O PostgREST mantém um cache do schema do banco de dados em memória. Quando você cria novas tabelas manualmente via SQL, o PostgREST não detecta automaticamente essas mudanças. Reiniciar o projeto força o PostgREST a recarregar o schema do zero, incluindo todas as tabelas existentes.

## Alternativa (se reiniciar não for possível)
Se você não puder reiniciar o projeto (por exemplo, em produção), você pode:
1. Aguardar 5-10 minutos (o cache pode atualizar automaticamente)
2. Contatar o suporte do Supabase para forçar uma atualização do cache

## Verificação
Após reiniciar, você pode verificar se funcionou executando este SQL:

```sql
-- Verificar se as tabelas estão acessíveis via API
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'subscription_payments', 'subscription_cancellations')
ORDER BY table_name;
```

Se as tabelas aparecerem e a aplicação ainda der erro, pode ser um problema de RLS (Row Level Security). Nesse caso, verifique as políticas de segurança das tabelas.



