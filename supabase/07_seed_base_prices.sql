-- ============================================================
-- 07 — SEED: Dados base das tabelas de preços (data.js → Supabase)
-- Rodar UMA VEZ. Pré-requisito: tabelas 01–06 já criadas.
-- ============================================================

-- Permite null em larguras (itens sem grade de larguras: adicionais, ferragens, batente, alizar, rodapé)
ALTER TABLE public.concremtp_itens_tabela ALTER COLUMN larguras DROP NOT NULL;

-- ── PORTAS LACCA — FÁBRICA ────────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
-- ESSENZIALE
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":176.49,"70":202.30,"80":228.12,"90":284.03,"100":359.52}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":186.08,"70":213.50,"80":240.93,"90":300.05,"100":379.85}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA BIANCO','SÓLIDA','{"60":267.44,"70":293.25,"80":319.07,"90":374.98,"100":450.47}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":202.66,"70":232.30,"80":261.95,"90":326.15,"100":412.84}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SARRAFO 6mm','{"60":213.66,"70":245.17,"80":276.65,"90":344.54,"100":436.17}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SÓLIDA','{"60":293.61,"70":323.25,"80":352.90,"90":417.10,"100":503.79}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":211.78,"70":242.75,"80":273.15,"90":340.83,"100":431.41}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','LACCA PET BLANCO','SARRAFO 6mm','{"60":223.27,"70":256.20,"80":289.10,"90":360.04,"100":455.80}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','ESSENZIALE','LACCA PET BLANCO','SÓLIDA','{"60":302.73,"70":333.70,"80":364.10,"90":431.78,"100":522.36}'::jsonb,null,null,null,null,true,now()),
-- INNOVAZIONE
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":195.29,"70":224.26,"80":253.22,"90":315.40,"100":399.36}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":204.88,"70":235.45,"80":266.03,"90":331.40,"100":419.68}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA BIANCO','SÓLIDA','{"60":286.24,"70":315.21,"80":344.17,"90":406.35,"100":490.31}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":224.24,"70":257.52,"80":290.77,"90":362.18,"100":458.58}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":235.25,"70":270.36,"80":305.48,"90":380.55,"100":481.92}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":315.19,"70":348.47,"80":381.72,"90":453.13,"100":549.53}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":234.32,"70":269.10,"80":303.85,"90":378.48,"100":479.21}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','LACCA PET BLANCO','SARRAFO 6mm','{"60":245.84,"70":282.53,"80":319.22,"90":397.67,"100":503.60}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','INNOVAZIONE','LACCA PET BLANCO','SÓLIDA','{"60":325.27,"70":360.05,"80":394.80,"90":469.43,"100":570.16}'::jsonb,null,null,null,null,true,now()),
-- SOFISTICATO
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','MEL LACCA BIANCO','SARRAFO 6mm','{"60":298.98,"70":344.98,"80":390.99,"90":487.51,"100":617.84}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','MEL LACCA BIANCO','SÓLIDA','{"60":389.93,"70":435.93,"80":481.94,"90":578.46,"100":708.79}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":314.72,"70":363.14,"80":411.57,"90":513.17,"100":650.36}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":405.67,"70":454.09,"80":502.52,"90":604.12,"100":741.31}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','LACCA PET BLANCO','SARRAFO 6mm','{"60":330.46,"70":381.30,"80":432.15,"90":538.83,"100":682.88}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','porta','SOFISTICATO','LACCA PET BLANCO','SÓLIDA','{"60":421.41,"70":472.25,"80":523.10,"90":629.78,"100":773.83}'::jsonb,null,null,null,null,true,now()),
-- adicionais
(gen_random_uuid(),'portasLacca','fabrica','adicional',null,null,'Montagem / Usinagem',null,87.08,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','adicional',null,null,'Borracha',null,22.00,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','adicional',null,null,'Frizos nas Portas',null,26.59,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','adicional',null,null,'Furo Universal',null,26.00,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','adicional',null,null,'Fechadura Soprano',null,42.00,null,null,null,true,now()),
-- ferragens
(gen_random_uuid(),'portasLacca','fabrica','ferragem',null,null,'Dobradiça Comum',null,5.68,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','ferragem',null,null,'Dob. Sobrepor',null,8.33,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','ferragem',null,null,'Dob. Pado Rolamento',null,11.11,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','ferragem',null,null,'Visor / Veneziana',null,135.00,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','fabrica','ferragem',null,null,'Painel 1 Lado / Bandeira',null,118.00,null,null,null,true,now());

-- ── PORTAS LACCA — DISTRIBUIDORA ─────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":229.44,"70":263.00,"80":296.56,"90":369.24,"100":467.37}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":241.90,"70":277.55,"80":313.21,"90":390.06,"100":493.80}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA BIANCO','SÓLIDA','{"60":347.67,"70":381.23,"80":414.80,"90":487.48,"100":585.61}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":263.46,"70":301.99,"80":340.54,"90":424.00,"100":536.69}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SARRAFO 6mm','{"60":277.76,"70":318.72,"80":359.64,"90":447.90,"100":567.02}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SÓLIDA','{"60":381.69,"70":420.23,"80":458.77,"90":542.23,"100":654.93}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":275.31,"70":315.57,"80":355.09,"90":443.08,"100":560.83}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','LACCA PET BLANCO','SARRAFO 6mm','{"60":290.25,"70":333.06,"80":375.83,"90":468.05,"100":592.54}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','ESSENZIALE','LACCA PET BLANCO','SÓLIDA','{"60":393.55,"70":433.81,"80":473.33,"90":561.31,"100":679.07}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":253.88,"70":291.53,"80":329.19,"90":410.02,"100":519.17}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":266.34,"70":306.08,"80":345.84,"90":430.82,"100":545.59}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA BIANCO','SÓLIDA','{"60":372.11,"70":409.77,"80":447.42,"90":528.26,"100":637.40}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":291.51,"70":334.78,"80":378.00,"90":470.83,"100":596.15}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":305.83,"70":351.47,"80":397.12,"90":494.72,"100":626.50}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":409.75,"70":453.01,"80":496.24,"90":589.07,"100":714.39}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":304.62,"70":349.83,"80":395.01,"90":492.02,"100":622.97}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','LACCA PET BLANCO','SARRAFO 6mm','{"60":319.59,"70":367.29,"80":414.99,"90":516.97,"100":654.68}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','INNOVAZIONE','LACCA PET BLANCO','SÓLIDA','{"60":422.85,"70":468.07,"80":513.24,"90":610.26,"100":741.21}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','MEL LACCA BIANCO','SARRAFO 6mm','{"60":388.68,"70":448.48,"80":508.29,"90":633.76,"100":803.19}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','MEL LACCA BIANCO','SÓLIDA','{"60":506.91,"70":566.71,"80":626.52,"90":752.00,"100":921.43}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":409.14,"70":472.08,"80":535.04,"90":667.12,"100":845.47}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":527.37,"70":590.32,"80":653.28,"90":785.36,"100":963.70}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','LACCA PET BLANCO','SARRAFO 6mm','{"60":429.59,"70":495.69,"80":561.79,"90":700.48,"100":887.74}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','porta','SOFISTICATO','LACCA PET BLANCO','SÓLIDA','{"60":547.83,"70":613.92,"80":680.03,"90":818.71,"100":1005.98}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','adicional',null,null,'Montagem / Usinagem',null,113.20,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','adicional',null,null,'Borracha',null,28.60,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','adicional',null,null,'Frizos nas Portas',null,34.57,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','adicional',null,null,'Furo Universal',null,33.80,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','adicional',null,null,'Fechadura Soprano',null,54.60,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','ferragem',null,null,'Dobradiça Comum',null,7.38,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','ferragem',null,null,'Dob. Sobrepor',null,10.83,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','ferragem',null,null,'Dob. Pado Rolamento',null,14.44,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','ferragem',null,null,'Visor / Veneziana',null,175.50,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','distribuidora','ferragem',null,null,'Painel 1 Lado / Bandeira',null,153.40,null,null,null,true,now());

-- ── PORTAS LACCA — DAG (mesmos preços que distribuidora) ──────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":229.44,"70":263.00,"80":296.56,"90":369.24,"100":467.37}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":241.90,"70":277.55,"80":313.21,"90":390.06,"100":493.80}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA BIANCO','SÓLIDA','{"60":347.67,"70":381.23,"80":414.80,"90":487.48,"100":585.61}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":263.46,"70":301.99,"80":340.54,"90":424.00,"100":536.69}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SARRAFO 6mm','{"60":277.76,"70":318.72,"80":359.64,"90":447.90,"100":567.02}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN','SÓLIDA','{"60":381.69,"70":420.23,"80":458.77,"90":542.23,"100":654.93}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":275.31,"70":315.57,"80":355.09,"90":443.08,"100":560.83}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','LACCA PET BLANCO','SARRAFO 6mm','{"60":290.25,"70":333.06,"80":375.83,"90":468.05,"100":592.54}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','ESSENZIALE','LACCA PET BLANCO','SÓLIDA','{"60":393.55,"70":433.81,"80":473.33,"90":561.31,"100":679.07}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA BIANCO','COLMEIA — SARRAFO 3mm','{"60":253.88,"70":291.53,"80":329.19,"90":410.02,"100":519.17}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA BIANCO','SARRAFO 6mm','{"60":266.34,"70":306.08,"80":345.84,"90":430.82,"100":545.59}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA BIANCO','SÓLIDA','{"60":372.11,"70":409.77,"80":447.42,"90":528.26,"100":637.40}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','COLMEIA — SARRAFO 3mm','{"60":291.51,"70":334.78,"80":378.00,"90":470.83,"100":596.15}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":305.83,"70":351.47,"80":397.12,"90":494.72,"100":626.50}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":409.75,"70":453.01,"80":496.24,"90":589.07,"100":714.39}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','LACCA PET BLANCO','COLMEIA — SARRAFO 3mm','{"60":304.62,"70":349.83,"80":395.01,"90":492.02,"100":622.97}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','LACCA PET BLANCO','SARRAFO 6mm','{"60":319.59,"70":367.29,"80":414.99,"90":516.97,"100":654.68}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','INNOVAZIONE','LACCA PET BLANCO','SÓLIDA','{"60":422.85,"70":468.07,"80":513.24,"90":610.26,"100":741.21}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','MEL LACCA BIANCO','SARRAFO 6mm','{"60":388.68,"70":448.48,"80":508.29,"90":633.76,"100":803.19}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','MEL LACCA BIANCO','SÓLIDA','{"60":506.91,"70":566.71,"80":626.52,"90":752.00,"100":921.43}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SARRAFO 6mm','{"60":409.14,"70":472.08,"80":535.04,"90":667.12,"100":845.47}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN','SÓLIDA','{"60":527.37,"70":590.32,"80":653.28,"90":785.36,"100":963.70}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','LACCA PET BLANCO','SARRAFO 6mm','{"60":429.59,"70":495.69,"80":561.79,"90":700.48,"100":887.74}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','porta','SOFISTICATO','LACCA PET BLANCO','SÓLIDA','{"60":547.83,"70":613.92,"80":680.03,"90":818.71,"100":1005.98}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','adicional',null,null,'Montagem / Usinagem',null,113.20,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','adicional',null,null,'Borracha',null,28.60,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','adicional',null,null,'Frizos nas Portas',null,34.57,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','adicional',null,null,'Furo Universal',null,33.80,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','adicional',null,null,'Fechadura Soprano',null,54.60,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','ferragem',null,null,'Dobradiça Comum',null,7.38,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','ferragem',null,null,'Dob. Sobrepor',null,10.83,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','ferragem',null,null,'Dob. Pado Rolamento',null,14.44,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','ferragem',null,null,'Visor / Veneziana',null,175.50,null,null,null,true,now()),
(gen_random_uuid(),'portasLacca','dag','ferragem',null,null,'Painel 1 Lado / Bandeira',null,153.40,null,null,null,true,now());

-- ── PORTAS UV — FÁBRICA ───────────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":166.18,"70":189.86,"80":213.53,"90":264.62,"100":334.73}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":176.85,"70":202.29,"80":227.77,"90":283.46,"100":358.65}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":257.13,"70":280.81,"80":304.48,"90":355.57,"100":425.68}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":180.71,"70":207.14,"80":233.58,"90":290.83,"100":368.12}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":190.52,"70":218.61,"80":246.69,"90":307.23,"100":388.93}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":271.66,"70":298.09,"80":324.53,"90":381.78,"100":459.07}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":199.81,"70":229.26,"80":258.69,"90":322.16,"100":407.84}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":210.12,"70":241.29,"80":272.46,"90":339.36,"100":429.69}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":290.76,"70":320.21,"80":349.64,"90":413.11,"100":498.79}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":187.08,"70":214.25,"80":241.42,"90":300.53,"100":380.35}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":197.74,"70":226.70,"80":255.64,"90":318.33,"100":402.93}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":278.03,"70":305.20,"80":332.37,"90":391.48,"100":471.30}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":199.96,"70":229.62,"80":259.28,"90":322.95,"100":408.91}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":209.77,"70":241.08,"80":272.39,"90":339.33,"100":429.72}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":290.91,"70":320.57,"80":350.23,"90":413.90,"100":499.86}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":220.03,"70":252.85,"80":285.67,"90":355.89,"100":450.68}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":230.33,"70":264.88,"80":299.45,"90":373.09,"100":472.54}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":310.98,"70":343.80,"80":376.62,"90":446.84,"100":541.63}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":280.63,"70":323.81,"80":366.99,"90":457.60,"100":579.92}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":371.58,"70":414.76,"80":457.94,"90":548.55,"100":670.87}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":294.66,"70":340.00,"80":385.34,"90":480.48,"100":608.91}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":390.16,"70":435.50,"80":480.84,"90":575.98,"100":704.41}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','adicional',null,null,'Montagem / Usinagem',null,87.08,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','adicional',null,null,'Borracha',null,22.00,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','adicional',null,null,'Frizos nas Portas',null,26.59,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','adicional',null,null,'Furo Universal',null,26.00,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','adicional',null,null,'Fechadura Soprano',null,42.00,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','ferragem',null,null,'Dobradiça Comum',null,5.68,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','ferragem',null,null,'Dob. Sobrepor',null,8.33,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','ferragem',null,null,'Dob. Pado Rolamento',null,11.11,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','ferragem',null,null,'Visor / Veneziana',null,135.00,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','fabrica','ferragem',null,null,'Painel 1 Lado / Bandeira',null,118.00,null,null,null,true,now());

-- ── PORTAS UV — DISTRIBUIDORA ────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":226.84,"70":259.16,"80":291.47,"90":361.21,"100":456.91}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":241.40,"70":276.13,"80":310.91,"90":386.92,"100":489.56}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":350.98,"70":383.31,"80":415.62,"90":485.35,"100":581.05}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":246.67,"70":282.75,"80":318.84,"90":396.98,"100":502.48}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":260.06,"70":298.40,"80":336.73,"90":419.37,"100":530.89}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":370.82,"70":406.89,"80":442.98,"90":521.13,"100":626.63}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":272.74,"70":312.94,"80":353.11,"90":439.75,"100":556.70}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":286.81,"70":329.36,"80":371.91,"90":463.23,"100":586.53}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":396.89,"70":437.09,"80":477.26,"90":563.90,"100":680.85}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":255.36,"70":292.45,"80":329.54,"90":410.22,"100":519.18}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":269.92,"70":309.45,"80":348.95,"90":434.52,"100":550.00}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":379.51,"70":416.60,"80":453.69,"90":534.37,"100":643.32}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":272.95,"70":313.43,"80":353.92,"90":440.83,"100":558.16}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":286.34,"70":329.07,"80":371.81,"90":463.19,"100":586.57}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":397.09,"70":437.58,"80":478.06,"90":564.97,"100":682.31}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":300.34,"70":345.14,"80":389.94,"90":485.79,"100":615.18}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":314.40,"70":361.56,"80":408.75,"90":509.27,"100":645.02}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":424.49,"70":469.29,"80":514.09,"90":609.94,"100":739.32}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":383.06,"70":442.00,"80":500.94,"90":624.62,"100":791.59}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":507.21,"70":566.15,"80":625.09,"90":748.77,"100":915.74}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":402.21,"70":464.10,"80":525.99,"90":655.86,"100":831.16}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":532.57,"70":594.45,"80":656.34,"90":786.21,"100":961.52}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','adicional',null,null,'Montagem / Usinagem',null,118.86,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','adicional',null,null,'Borracha',null,30.03,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','adicional',null,null,'Frizos nas Portas',null,36.30,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','adicional',null,null,'Furo Universal',null,35.49,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','adicional',null,null,'Fechadura Soprano',null,54.60,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','ferragem',null,null,'Dobradiça Comum',null,7.38,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','ferragem',null,null,'Dob. Sobrepor',null,10.83,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','ferragem',null,null,'Dob. Pado Rolamento',null,14.44,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','ferragem',null,null,'Visor / Veneziana',null,184.28,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','distribuidora','ferragem',null,null,'Painel 1 Lado / Bandeira',null,161.07,null,null,null,true,now());

-- ── PORTAS UV — DAG ───────────────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":216.03,"70":246.82,"80":277.59,"90":344.01,"100":435.15}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":229.91,"70":262.98,"80":296.10,"90":368.50,"100":466.25}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":334.27,"70":365.05,"80":395.82,"90":462.24,"100":553.38}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":234.92,"70":269.28,"80":303.65,"90":378.08,"100":478.56}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":247.68,"70":284.19,"80":320.70,"90":399.40,"100":505.61}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":353.16,"70":387.52,"80":421.89,"90":496.31,"100":596.79}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":259.75,"70":298.04,"80":336.30,"90":418.81,"100":530.19}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":273.16,"70":313.68,"80":354.20,"90":441.17,"100":558.60}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','ESSENZIALE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":377.99,"70":416.27,"80":454.53,"90":537.04,"100":648.43}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','COLMEIA — SARRAFO 3mm','{"60":243.20,"70":278.53,"80":313.85,"90":390.69,"100":494.46}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SARRAFO 6mm','{"60":257.06,"70":294.71,"80":332.33,"90":413.83,"100":523.81}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','PINTURA UV (BRA / CUR / IMB / FRE)','SÓLIDA','{"60":361.44,"70":396.76,"80":432.08,"90":508.92,"100":612.69}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":259.95,"70":298.51,"80":337.06,"90":419.83,"100":531.58}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":272.70,"70":313.40,"80":354.11,"90":441.13,"100":558.64}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":378.18,"70":416.74,"80":455.30,"90":538.07,"100":649.82}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','COLMEIA — SARRAFO 3mm','{"60":286.04,"70":328.70,"80":371.37,"90":462.66,"100":585.88}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":299.43,"70":344.34,"80":389.29,"90":485.02,"100":614.30}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','INNOVAZIONE','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":404.27,"70":446.94,"80":489.61,"90":580.89,"100":704.12}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SARRAFO 6mm','{"60":364.82,"70":420.95,"80":477.09,"90":594.88,"100":753.90}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','SOFISTICATO','MELAMÍNICO CURUPIXA','SÓLIDA','{"60":483.05,"70":539.19,"80":595.32,"90":713.12,"100":872.13}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SARRAFO 6mm','{"60":383.06,"70":442.00,"80":500.94,"90":624.62,"100":791.58}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','porta','SOFISTICATO','MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO','SÓLIDA','{"60":507.21,"70":566.15,"80":625.09,"90":748.77,"100":915.74}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','adicional',null,null,'Montagem / Usinagem',null,113.20,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','adicional',null,null,'Borracha',null,28.60,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','adicional',null,null,'Frizos nas Portas',null,34.57,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','adicional',null,null,'Furo Universal',null,33.80,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','adicional',null,null,'Fechadura Soprano',null,54.60,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','ferragem',null,null,'Dobradiça Comum',null,7.38,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','ferragem',null,null,'Dob. Sobrepor',null,10.83,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','ferragem',null,null,'Dob. Pado Rolamento',null,14.44,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','ferragem',null,null,'Visor / Veneziana',null,175.50,null,null,null,true,now()),
(gen_random_uuid(),'portasUV','dag','ferragem',null,null,'Painel 1 Lado / Bandeira',null,153.40,null,null,null,true,now());

-- ── PORTAS ELO — ELO ─────────────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'portasELO','elo','porta','ESSENZIALE','ELO BRANCO','COLMEIA — SARRAFO 3mm','{"60":215.04,"70":215.04,"80":215.04,"90":261.37,"100":330.58,"110":380.18}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','ESSENZIALE','ELO BRANCO','SARRAFO 6mm','{"60":229.02,"70":229.02,"80":229.02,"90":278.36}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','ESSENZIALE','ELO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":221.49,"70":221.49,"80":221.49,"90":269.21,"100":340.50,"110":391.58}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','ESSENZIALE','ELO CURUPIXA','SARRAFO 6mm','{"60":235.89,"70":235.89,"80":235.89,"90":286.71}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','INNOVAZIONE','ELO BRANCO','COLMEIA — SARRAFO 3mm','{"60":240.85,"70":240.85,"80":240.85,"90":292.73}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','INNOVAZIONE','ELO BRANCO','SARRAFO 6mm','{"60":256.50,"70":256.50,"80":256.50,"90":311.76}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','INNOVAZIONE','ELO CURUPIXA','COLMEIA — SARRAFO 3mm','{"60":252.89,"70":252.89,"80":252.89,"90":307.37}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','porta','INNOVAZIONE','ELO CURUPIXA','SARRAFO 6mm','{"60":269.33,"70":269.33,"80":269.33,"90":327.35}'::jsonb,null,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','adicional',null,null,'Montagem / Usinagem',null,84.00,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','adicional',null,null,'Borracha',null,10.47,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','adicional',null,null,'Frizos nas Portas',null,29.32,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','adicional',null,null,'Furo Universal',null,28.67,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','adicional',null,null,'Fechadura Soprano',null,44.10,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','ferragem',null,null,'Dobradiça Comum',null,5.96,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','ferragem',null,null,'Dob. Sobrepor',null,6.30,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','ferragem',null,null,'Dob. Pado Rolamento',null,11.67,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','ferragem',null,null,'Visor / Veneziana',null,148.84,null,null,null,true,now()),
(gen_random_uuid(),'portasELO','elo','ferragem',null,null,'Painel 1 Lado / Bandeira',null,130.10,null,null,null,true,now());

-- ── BATENTE & ALIZAR LACCA (base — mult aplicado no render; salvo p/ cada canal) ──
-- Canal FÁBRICA
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
-- batente
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'5,5 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,98.94,115.94,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'5,5 cm','LACCA PET BLANCO',null,103.38,120.38,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'6,5 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,109.70,126.70,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'6,5 cm','LACCA PET BLANCO',null,114.63,131.63,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'7,5 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,120.39,137.39,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'7,5 cm','LACCA PET BLANCO',null,125.80,142.80,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'8,5 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,135.11,167.11,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'8,5 cm','LACCA PET BLANCO',null,141.18,173.18,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'10 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,149.84,181.84,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'10 cm','LACCA PET BLANCO',null,156.57,188.57,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'12 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,178.00,220.00,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'12 cm','LACCA PET BLANCO',null,186.01,228.01,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'14 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,224.05,266.05,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'14 cm','LACCA PET BLANCO',null,234.13,276.13,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'18 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,273.15,325.15,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'18 cm','LACCA PET BLANCO',null,285.44,337.44,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'21 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,345.90,397.90,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','batente',null,'21 cm','LACCA PET BLANCO',null,361.46,413.46,null,null,true,now()),
-- alizar 9mm
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,113.24,131.24,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×5','LACCA PET BLANCO',null,118.32,136.32,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×7','FENDI / GRAFITE / NERO / BLUE E GREEN',null,120.85,138.85,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×7','LACCA PET BLANCO',null,126.29,144.29,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,134.88,152.88,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×10','LACCA PET BLANCO',null,140.95,158.95,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,136.88,154.88,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×5','LACCA PET BLANCO',null,143.04,161.04,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×7','FENDI / GRAFITE / NERO / BLUE E GREEN',null,143.41,161.41,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×7','LACCA PET BLANCO',null,149.86,167.86,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,157.75,175.75,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','7×10','LACCA PET BLANCO',null,164.85,182.85,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','10×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,173.32,191.32,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','10×5','LACCA PET BLANCO',null,181.11,199.11,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','3cm Pinado','FENDI / GRAFITE / NERO / BLUE E GREEN',null,65.27,83.27,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','3cm Pinado','LACCA PET BLANCO',null,92.02,110.02,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×2 (Drywall)','FENDI / GRAFITE / NERO / BLUE E GREEN',null,92.02,110.02,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','5×2 (Drywall)','LACCA PET BLANCO',null,92.02,110.02,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','10×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,236.58,254.58,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar9','10×10','LACCA PET BLANCO',null,247.22,265.22,null,null,true,now()),
-- alizar 15mm
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,151.46,169.46,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×5','LACCA PET BLANCO',null,158.27,176.27,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×7','FENDI / GRAFITE / NERO / BLUE E GREEN',null,157.57,175.57,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×7','LACCA PET BLANCO',null,164.66,182.66,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,171.86,189.86,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','5×10','LACCA PET BLANCO',null,179.59,197.59,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,167.17,185.17,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7×5','LACCA PET BLANCO',null,174.69,192.69,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,189.82,207.82,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7×10','LACCA PET BLANCO',null,198.36,216.36,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','10×5','FENDI / GRAFITE / NERO / BLUE E GREEN',null,210.22,228.22,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','10×5','LACCA PET BLANCO',null,219.67,237.67,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','10×10','FENDI / GRAFITE / NERO / BLUE E GREEN',null,286.95,304.95,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','10×10','LACCA PET BLANCO',null,299.85,317.85,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','3cm Pinado','FENDI / GRAFITE / NERO / BLUE E GREEN',null,100.28,118.28,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7 Plus','FENDI / GRAFITE / NERO / BLUE E GREEN',null,218.29,236.29,null,null,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','alizar','alizar15','7 Plus','LACCA PET BLANCO',null,228.11,246.11,null,null,true,now()),
-- rodape
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'5 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,null,null,26.89,11.20,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'5 cm','LACCA PET BLANCO',null,null,null,28.10,11.71,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'7 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,null,null,33.34,13.89,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'7 cm','LACCA PET BLANCO',null,null,null,34.83,14.51,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'10 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,null,null,47.23,19.68,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'10 cm','LACCA PET BLANCO',null,null,null,49.35,20.56,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'15 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,null,null,56.13,23.39,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'15 cm','LACCA PET BLANCO',null,null,null,58.65,24.44,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'20 cm','FENDI / GRAFITE / NERO / BLUE E GREEN',null,null,null,85.99,35.83,true,now()),
(gen_random_uuid(),'laccaAcab','fabrica','rodape',null,'20 cm','LACCA PET BLANCO',null,null,null,89.86,37.44,true,now());

-- Canal DISTRIBUIDORA (mesmos preços base — mult aplicado no render)
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em)
SELECT gen_random_uuid(),'laccaAcab','distribuidora',tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,true,now()
FROM public.concremtp_itens_tabela WHERE produto='laccaAcab' AND canal='fabrica';

-- Canal DAG
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em)
SELECT gen_random_uuid(),'laccaAcab','dag',tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,true,now()
FROM public.concremtp_itens_tabela WHERE produto='laccaAcab' AND canal='fabrica';

-- ── BATENTE & ALIZAR MELAMÍNICO (fabrica) ────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
-- batente
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'5,5 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,88.22,105.22,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'5,5 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,94.64,111.64,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'6,5 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,97.82,114.82,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'6,5 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,104.86,121.86,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'7,5 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,107.34,124.34,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'7,5 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,115.06,132.06,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'8,5 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,120.48,152.48,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'8,5 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,130.45,162.45,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'10 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,133.61,165.61,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'10 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,145.84,177.84,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'12 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,158.72,200.72,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'12 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,169.74,211.74,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'14 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,199.78,241.78,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'14 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,213.53,255.53,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'18 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,243.56,295.56,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'18 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,259.82,311.82,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'21 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,308.44,360.44,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','batente',null,'21 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,329.34,381.34,null,null,true,now()),
-- alizar 9mm
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×5','MTX / ML CURUPIXA / LACCA BIANCO',null,100.98,118.98,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×5','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,107.74,125.74,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×7','MTX / ML CURUPIXA / LACCA BIANCO',null,107.76,125.76,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×7','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,116.38,134.38,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×10','MTX / ML CURUPIXA / LACCA BIANCO',null,120.28,138.28,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×10','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,131.26,149.26,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7×5','MTX / ML CURUPIXA / LACCA BIANCO',null,122.05,140.05,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7×5','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,133.21,151.21,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7×10','MTX / ML CURUPIXA / LACCA BIANCO',null,140.40,158.40,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7×10','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,157.80,175.80,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','10×5','MTX / ML CURUPIXA / LACCA BIANCO',null,154.54,172.54,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','10×5','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,169.37,187.37,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','10×10','MTX / ML CURUPIXA / LACCA BIANCO',null,210.94,228.94,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','10×10','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,231.19,249.19,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','3cm Pinado','ML TODOS OS PADRÕES',null,62.42,80.42,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','5×2 (Drywall)','ML TODOS OS PADRÕES',null,88.84,106.84,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7 Plus','MTX / ML CURUPIXA / LACCA BIANCO',null,161.46,179.46,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar9','7 Plus','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,181.47,199.47,null,null,true,now()),
-- alizar 15mm
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','5×5','MTX / ML CURUPIXA / LACCA BIANCO',null,135.06,153.06,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','5×5','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,148.16,166.16,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','5×10','MTX / ML CURUPIXA / LACCA BIANCO',null,153.25,171.25,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','5×10','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,167.92,185.92,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7×5','MTX / ML CURUPIXA / LACCA BIANCO',null,149.06,167.06,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7×5','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,161.57,179.57,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7×10','MTX / ML CURUPIXA / LACCA BIANCO',null,169.27,187.27,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7×10','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,185.20,203.20,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','10×5','MTX / ML CURUPIXA / LACCA BIANCO',null,187.45,205.45,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','5×2 (Drywall)','ML TODOS OS PADRÕES',null,104.83,122.83,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7 Plus','MTX / ML CURUPIXA / LACCA BIANCO',null,194.66,212.66,null,null,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','alizar','alizar15','7 Plus','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,212.98,230.98,null,null,true,now()),
-- rodape
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'5 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,null,null,23.98,9.99,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'5 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,null,null,27.12,11.30,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'7 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,null,null,29.74,12.39,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'7 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,null,null,32.04,13.35,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'10 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,null,null,42.12,17.55,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'10 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,null,null,45.63,19.01,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'15 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,null,null,50.04,20.85,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'15 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,null,null,54.15,22.56,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'20 cm','MTX / ML CURUPIXA / LACCA BIANCO',null,null,null,76.68,31.95,true,now()),
(gen_random_uuid(),'melamAcab','fabrica','rodape',null,'20 cm','ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',null,null,null,83.43,34.76,true,now());

-- Canal DISTRIBUIDORA e DAG (copia do fabrica)
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em)
SELECT gen_random_uuid(),'melamAcab','distribuidora',tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,true,now()
FROM public.concremtp_itens_tabela WHERE produto='melamAcab' AND canal='fabrica';

INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em)
SELECT gen_random_uuid(),'melamAcab','dag',tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,true,now()
FROM public.concremtp_itens_tabela WHERE produto='melamAcab' AND canal='fabrica';

-- ── BATENTE ELO ───────────────────────────────────────────────────────────────
INSERT INTO public.concremtp_itens_tabela
  (id,produto,canal,tipo,colecao,linha,acabamento,larguras,preco_venda,preco_protect,preco_regua,preco_ml,ativo,criado_em) VALUES
(gen_random_uuid(),'batenteELO','elo','batente',null,'5,5 cm','ELO BRANCO',null,101.94,123.49,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'5,5 cm','ELO CURUPIXÁ',null,104.99,126.55,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'6,5 cm','ELO BRANCO',null,114.17,135.73,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'6,5 cm','ELO CURUPIXÁ',null,117.59,139.15,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'7,5 cm','ELO BRANCO',null,127.87,149.43,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'7,5 cm','ELO CURUPIXÁ',null,131.71,153.26,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'8,5 cm','ELO BRANCO',null,143.21,183.79,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'8,5 cm','ELO CURUPIXÁ',null,147.51,188.08,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'10 cm','ELO BRANCO',null,160.40,200.97,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'10 cm','ELO CURUPIXÁ',null,165.21,205.78,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'12 cm','ELO BRANCO',null,179.65,232.90,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'12 cm','ELO CURUPIXÁ',null,185.04,238.29,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'14/15 cm','ELO BRANCO',null,224.56,277.82,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'14/15 cm','ELO CURUPIXÁ',null,231.30,284.55,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'18 cm','ELO BRANCO',null,251.51,317.44,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'18 cm','ELO CURUPIXÁ',null,259.05,324.98,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'21 cm','ELO BRANCO',null,281.69,347.62,null,null,true,now()),
(gen_random_uuid(),'batenteELO','elo','batente',null,'21 cm','ELO CURUPIXÁ',null,290.14,356.07,null,null,true,now());
