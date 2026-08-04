# Recuperação de Pedido por Link + Pedidos no Painel

## Objetivo

Quando o cliente gera o pedido no checkout, o sistema salva o pedido no banco de dados com uma referência única (ex: `SS-4F8K2M`) e exibe um **link de recuperação**. Se o cliente sair do WhatsApp antes de concluir, ele abre o link (em qualquer dispositivo) e o carrinho é restaurado com seus dados. Os pedidos gerados também aparecem em uma nova aba **Pedidos** no painel administrativo.

## Fluxo

```text
Checkout → "Enviar Pedido" → salva pedido no banco (ref SS-XXXXXX)
       → tela de confirmação mostra: prévia WhatsApp + link de recuperação (copiar)
       → cliente abre WhatsApp (carrinho limpo, pedido salvo na nuvem)

Cliente saiu do WhatsApp? → abre systemseg.../pedido/<id>
       → vê resumo do pedido → "Restaurar meu pedido"
       → carrinho + dados do formulário preenchidos → volta ao checkout

Painel Admin → nova aba "Pedidos": referência, cliente, itens, total, status
```

## Etapas

### 1. Banco de dados — tabela `orders` (migration)
Campos: referência única (SS-XXXXXX), nome, telefone, endereço, cidade, CEP, itens (JSON), total, status (`pendente` / `concluido` / `cancelado`), datas.
- Qualquer visitante pode **criar** um pedido (checkout público).
- Qualquer pessoa **com o link** (ID único impossível de adivinhar) pode **ler** aquele pedido — é o que permite a recuperação em qualquer dispositivo.
- Somente **admin** pode listar todos e alterar status.

### 2. Checkout (`src/routes/checkout.tsx`)
- Ao enviar: gera a referência, salva o pedido no banco e inclui a referência na mensagem do WhatsApp (ex: `*PEDIDO SS-4F8K2M*` — facilita o atendimento identificar).
- Tela de confirmação ganha um bloco **"Guarde seu link de recuperação"** com o link e botão **Copiar link** (com fallback para navegadores sem clipboard API).
- Mantém os botões atuais (Abrir WhatsApp, Editar dados).

### 3. Página de recuperação (`src/routes/pedido.$orderId.tsx`)
- Rota pública `/pedido/<id>` que busca o pedido no banco.
- Mostra resumo (itens, total, dados) e botão **"Restaurar meu pedido"**: recoloca os itens no carrinho, pré-preenche o formulário do checkout (via armazenamento local) e redireciona para `/checkout`.
- Pedido não encontrado → mensagem amigável com link para a loja.

### 4. Painel admin — aba Pedidos (`src/routes/_authenticated/admin/pedidos.tsx`)
- Lista pedidos: referência, data, cliente, telefone, nº de itens, total e badge de status.
- Clique expande detalhes (itens, endereço) e permite mudar status (pendente → concluído/cancelado).
- Adiciona "Pedidos" no menu lateral do admin (dashboard, produtos e categorias).

### 5. Validação
- Teste ponta a ponta com Playwright: criar pedido → copiar link → abrir em nova sessão → restaurar carrinho → conferir no painel admin.

## Detalhes técnicos

- Migration com `GRANT` para `anon` (criar/ler), `authenticated` (admin) e `service_role`, RLS habilitado, policy admin via `has_role`.
- A leitura pública usa o UUID do pedido na URL como "segredo" do link (padrão de links de recuperação de carrinho); dados expostos são apenas os do próprio pedido.
- O insert no checkout usa o client Supabase do navegador (policy de insert público) — sem necessidade de função de servidor.
- Tipos do Supabase são regenerados automaticamente após a migration aprovada.
