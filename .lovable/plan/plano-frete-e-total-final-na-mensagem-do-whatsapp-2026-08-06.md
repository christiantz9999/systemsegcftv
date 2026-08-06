# Plano — Frete e total final na mensagem do WhatsApp

## Objetivo
Exibir o frete ("A combinar") e o total final de forma clara na mensagem do WhatsApp e nas telas de resumo, deixando explícito que o valor do frete será definido no atendimento e somado depois.

## Mudanças

### 1. Mensagem do WhatsApp (`src/routes/checkout.tsx`)
Reestruturar o bloco de valores da mensagem gerada no checkout:

```text
*PRODUTOS:*
- 2x Câmera X (R$ 199,00)

*SUBTOTAL: R$ 398,00*
*FRETE: A combinar*
*TOTAL DOS PRODUTOS: R$ 398,00*

_O valor do frete será calculado e somado ao total durante o atendimento._
```

A prévia da mensagem exibida na tela de sucesso reflete automaticamente o novo formato, antes do redirecionamento ao WhatsApp.

### 2. Resumo do pedido no checkout (`src/routes/checkout.tsx`)
- Renomear o rótulo "Total" para "Total dos produtos".
- Manter a linha "Frete — A combinar" já existente, adicionando nota explicativa de que o frete será somado no atendimento.

### 3. Página de recuperação de pedido (`src/routes/pedido.$orderId.tsx`)
- Adicionar linha "Frete: A combinar" acima do total.
- Renomear o rótulo "Total" para "Total dos produtos" com a mesma nota sobre o frete.

### 4. Painel admin de pedidos (`src/routes/_authenticated/admin/pedidos.tsx`)
- No detalhe do pedido, rotular o valor como "Total dos produtos" e exibir "Frete: a combinar", para o atendente saber que deve somar o frete ao negociar.

## Observações técnicas
- Nenhuma mudança de banco de dados: o frete permanece "a combinar" (sem valor fixo), então `orders.total` continua representando o total dos produtos.
- Sem novas dependências; apenas ajustes de texto e layout nos componentes existentes.
