# CLAUDE.md — App Tabelas Comerciais

## Visão Geral
App web em HTML, CSS e JavaScript puro (sem frameworks, sem build tools)
para substituir a planilha TABELAS_COMERCIAL.xlsx.

## Estrutura de Arquivos
```
index.html          ← estrutura HTML + links para CSS e JS externos
CLAUDE.md
Logos/
src/
  css/
    styles.css      ← todo o CSS (variáveis, layout, tabelas, sidebar, modal, print)
  js/
    data.js         ← constantes de dados: CHANNELS, portasLaccaData, portasUVData,
                       portasELOData, laccaAcabBase, melamAcabBase, eloAcabBase,
                       DATA, e variáveis de estado (currentSection, currentChannel, etc.)
    render.js       ← todas as funções de render: fmt, calcPrice, onSearch, applySearch,
                       buildBreadcrumb, renderPortasELO, renderBatenteELO, switchTab,
                       scaleAcabBase, renderProtectTable, renderRodapeTable,
                       renderKitCorrerTable, renderAcabSection, renderLaccaAcab,
                       renderMelamAcab, renderPortasLacca, renderColecaoSection,
                       renderTable, render, navigate, setChannel, toggleCollapse,
                       toggleSidebar, closeSidebar, toggleTheme, printSection, setDate
    reajuste.js     ← sistema de reajuste de preços por linha: _RJ_ORIG, rjLoad, rjSave,
                       rjGetM, rjGetLinhas, rjApplyToMemory, rjSamplePrice,
                       interceptação do render, badge, modal, formulário, histórico,
                       desfazer, exportar CSV, init
```

**Ordem de carregamento dos scripts (obrigatória):**
1. `src/js/data.js` — define os dados usados pelos demais
2. `src/js/render.js` — usa os dados, define render() e funções de UI
3. `src/js/reajuste.js` — intercepta render() e usa dados e funções de render

## Tecnologia
- HTML5
- CSS3 (sem Tailwind, sem Bootstrap)
- JavaScript puro (vanilla JS, sem jQuery, sem React)
- Nenhuma dependência externa ou CDN

## Fidelidade ao Layout da Planilha
O layout das tabelas deve ser IDÊNTICO ao da planilha original:

- Cada aba da planilha vira uma seção do app
- A hierarquia visual deve ser respeitada:
  1. Produto (ex: PORTAS LACCA)
  2. Canal de venda (FÁBRICA / DISTRIBUIDORA / DAG / ELO)
  3. Coleção (ESSENZIALE / INNOVAZIONE / SOFISTICATO)
  4. Linha + Acabamento (ex: COLMEIA SARRAFO 3mm | MEL LACCA BIANCO)
  5. Larguras como colunas (60 / 70 / 80 / 90 / 100 cm)
- Itens Adicionais e Ferragens sempre ao final de cada seção de portas
- Batente, Alizar e Rodapé com suas subdivisões de espessura (9mm / 15mm / 30mm)
- Rodapé com duas linhas de preço: RÉGUA e ML (metro linear)
- Batente e Alizar com duas linhas: PREÇO DE VENDA e C/ PROTECT+

## Estrutura de Abas (planilha → seção do app)
- LACCA_Fábrica           → Portas LACCA > canal Fábrica
- UV_Fábrica              → Portas UV/Melamínico > canal Fábrica
- Bat, Ali e Rod_LACCA_Fábrica     → Batente/Alizar/Rodapé LACCA > canal Fábrica
- Bat, Ali e Rod_Melam_Fábrica     → Batente/Alizar/Rodapé Melamínico > canal Fábrica
- Portas_Elo_Distribuidora         → Portas ELO > canal Distribuidora
- LACCA_Distribuidora     → Portas LACCA > canal Distribuidora
- UV_Distribuidora        → Portas UV/Melamínico > canal Distribuidora
- Bat, Ali e Rod_LACCA_Distribuid  → Batente/Alizar/Rodapé LACCA > canal Distribuidora
- Bat, Ali e Rod_Melam_Distribuid  → Batente/Alizar/Rodapé Melamínico > canal Distribuidora
- Bat, Ali e Rod_Melam_Elo         → Batente/Alizar/Rodapé ELO > canal Distribuidora
- LACCA_DAG               → Portas LACCA > canal DAG
- UV_DAG                  → Portas UV/Melamínico > canal DAG
- Bat, Ali e Rod_LACCA_DAG         → Batente/Alizar/Rodapé LACCA > canal DAG
- Bat, Ali e Rod_Melam_DAG         → Batente/Alizar/Rodapé Melamínico > canal DAG

## Estrutura de Navegação
- Sidebar fixa com menu por produto
- Seletor de canal de venda no header (Fábrica / Distribuidora / DAG / ELO)
- Trocar canal atualiza os preços sem recarregar a página
- Menu ativo destacado na sidebar

## Tabelas de Preço — Regras de Renderização
- Cabeçalho da tabela: LINHA | ACABAMENTO | 60cm | 70cm | 80cm | 90cm | 100cm
- Portas ELO: adicionar coluna 110cm onde aplicável
- Todos os preços em formato brasileiro: R$ X.XXX,XX
- Coleções separadas por título em destaque (cor de fundo diferente no cabeçalho)
- Linhas alternadas (zebra striping) para facilitar leitura
- Scroll horizontal em telas pequenas

## Dados
- Os preços de cada canal estão fixos no JavaScript (não há cálculo em tempo real)
- Usar os valores da coluna "Reajustada" da planilha para cada canal
- Canal Fábrica: coluna base (sem reajuste)
- Canal Distribuidora: coluna reajustada com adicional de 30%
- Canal DAG: coluna reajustada com adicional de 30%
- Canal ELO: coluna própria da aba Portas_Elo_Distribuidora

## Funcionalidades Obrigatórias
- Navegação por produto e canal sem recarregar a página
- Impressão com @media print (sem sidebar, sem header, só as tabelas)
- Campo de busca que filtra linhas da tabela pelo texto digitado
- Cabeçalho das tabelas sticky ao scrollar
- Highlight ao passar o mouse nas linhas
- Sidebar colapsável no mobile (botão hambúrguer)

## O que NÃO fazer
- Não usar frameworks CSS (Bootstrap, Tailwind, etc.)
- Não usar bibliotecas JS (jQuery, React, Vue, etc.)
- Não usar CDN externo de nenhum tipo
- Não inventar dados — usar apenas os valores fornecidos nos prompts
- Não simplificar ou omitir linhas da tabela — todas devem aparecer
- Não alterar o layout visual sem instrução explícita
- Não misturar responsabilidades entre os arquivos: dados em data.js, render em render.js, reajuste em reajuste.js

## Estilo Visual
- Fundo geral: branco (#ffffff)
- Sidebar: cinza escuro (#2c3e50) com texto branco
- Header: azul escuro (#1a252f) com texto branco
- Cabeçalho de coleção: azul médio (#2980b9) com texto branco
- Cabeçalho de tabela: cinza claro (#f2f2f2) com texto escuro
- Linhas zebra: branco / cinza muito claro (#fafafa)
- Highlight hover: amarelo claro (#fffde7)
- Fonte: Arial, sans-serif
- Tamanho base: 14px

## Impressão em PDF por Tabela

- Cada seção do app deve ter um botão "🖨️ Imprimir PDF" visível no topo da tabela
- Ao clicar, deve abrir a janela de impressão do navegador com APENAS aquela tabela
  (sem sidebar, sem header, sem botões, sem outras seções)
- Usar window.print() com CSS @media print para controlar o que aparece
- O PDF gerado deve manter o layout fiel à tabela: títulos de coleção, cabeçalhos,
  larguras como colunas, preços formatados em R$
- Incluir no topo do PDF: nome do produto + canal de venda + data de impressão
- Cada tabela deve ser impressa em orientação paisagem (landscape)
- Adicionar no CSS: `@page { size: landscape; margin: 10mm; }`
- Nunca imprimir mais de uma seção por vez — só a tabela ativa no momento do clique

## Acréscimo por Porcentagem

- Adicionar um painel flutuante ou fixo no header chamado "Acréscimo (%)"
- O painel deve conter:
  - Um campo numérico (`input type="number"`) para digitar a porcentagem
    (ex: digitar 10 aplica +10% sobre todos os preços visíveis)
  - Um botão "Aplicar" que recalcula e exibe os preços com o acréscimo
  - Um botão "Resetar" que volta aos preços originais da tabela
  - Um indicador visual destacado em laranja quando um acréscimo estiver ativo
    (ex: badge "Acréscimo: +10% ativo")
- O acréscimo deve ser aplicado APENAS nos preços exibidos na tela —
  os dados originais no JavaScript nunca devem ser sobrescritos
- Fórmula: `precoExibido = precoOriginal * (1 + porcentagem / 100)`
- O acréscimo persiste ao navegar entre seções e canais enquanto estiver ativo
- Ao trocar de canal de venda, o acréscimo continua aplicado sobre os novos preços
- O acréscimo também deve ser refletido na impressão em PDF
- Permitir valores decimais (ex: 5.5 para +5,5%)
- Não permitir valores negativos no campo (`min="0"`)
- Ao imprimir com acréscimo ativo, incluir no topo do PDF:
  "* Preços com acréscimo de X% aplicado"