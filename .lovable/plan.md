# Plan: Botão de Editar Dados na Tela de Confirmação

## Objetivo
Adicionar, na tela de confirmação do checkout que exibe a prévia da mensagem do WhatsApp, um botão que permita ao usuário voltar ao formulário e editar seus dados pessoais e de entrega sem perder as informações já preenchidas.

## Escopo
A alteração se concentra em `src/routes/checkout.tsx`, onde a tela de sucesso/confirmacao (`isSuccess`) já renderiza a prévia da mensagem do WhatsApp e os botões de ação.

## Implementação

1. Preservar estado de edição
   - Manter o `formData` já existente no estado do componente.
   - Adicionar um novo estado booleano `isEditing` (ou similar) para controlar se o usuário quer voltar ao formulário.

2. Alterar a lógica de renderização
   - Atualmente o checkout mostra o formulário quando `!isSuccess` e a tela de confirmação quando `isSuccess`.
   - Introduzir um terceiro estado de visualização: quando o usuário clicar em "Editar meus dados", voltar ao formulário sem apagar `formData` e sem alterar o carrinho.

3. Ajustar o formulário para modo de edição
   - Garantir que o formulário já exiba os valores salvos em `formData`.
   - Ao submeter novamente, apenas regenerar a mensagem do WhatsApp e retornar à tela de confirmação.

4. Atualizar a tela de confirmação
   - Adicionar um botão secundário entre "Abrir WhatsApp Agora" e "Voltar para Início" com o texto "Editar meus dados".
   - O botão deve alterar o estado para exibir o formulário novamente.

5. Validar responsividade e UX
   - Garantir que os três botões fiquem bem organizados em mobile (empilhados) e desktop (lado a lado ou em linha).
   - Manter o fluxo existente de limpar o carrinho apenas quando a mensagem for confirmada/enviada via WhatsApp.

## Arquivos afetados
- `src/routes/checkout.tsx`

## Não incluído neste plano
- Mudanças no layout, cores, tipografia ou outros componentes.
- Alterações no carrinho, na loja ou no painel administrativo.
