// ── CHANNELS ──────────────────────────────────────────────────
const CHANNELS = {
  fabrica:       { label: 'Fábrica',                 mult: 1.00, cls: 'ch-fabrica' },
  distribuidora: { label: 'Distribuidora (DAG 30%)',  mult: 1.30, cls: 'ch-distribuidora' },
  dag:           { label: 'DAG',                     mult: 1.20, cls: 'ch-dag' },
  elo:           { label: 'ELO / Distribuidora ELO',  mult: 1.15, cls: 'ch-elo' },
};

// ── PORTAS LACCA DATA ─────────────────────────────────────────
const portasLaccaData = {
  fabrica: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [176.49, 202.30, 228.12, 284.03, 359.52] },
            { linha: 'SARRAFO 6mm',           p: [186.08, 213.50, 240.93, 300.05, 379.85] },
            { linha: 'SÓLIDA',                p: [267.44, 293.25, 319.07, 374.98, 450.47] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [202.66, 232.30, 261.95, 326.15, 412.84] },
            { linha: 'SARRAFO 6mm',           p: [213.66, 245.17, 276.65, 344.54, 436.17] },
            { linha: 'SÓLIDA',                p: [293.61, 323.25, 352.90, 417.10, 503.79] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [211.78, 242.75, 273.15, 340.83, 431.41] },
            { linha: 'SARRAFO 6mm',           p: [223.27, 256.20, 289.10, 360.04, 455.80] },
            { linha: 'SÓLIDA',                p: [302.73, 333.70, 364.10, 431.78, 522.36] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [195.29, 224.26, 253.22, 315.40, 399.36] },
            { linha: 'SARRAFO 6mm',           p: [204.88, 235.45, 266.03, 331.40, 419.68] },
            { linha: 'SÓLIDA',                p: [286.24, 315.21, 344.17, 406.35, 490.31] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [224.24, 257.52, 290.77, 362.18, 458.58] },
            { linha: 'SARRAFO 6mm',           p: [235.25, 270.36, 305.48, 380.55, 481.92] },
            { linha: 'SÓLIDA',                p: [315.19, 348.47, 381.72, 453.13, 549.53] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [234.32, 269.10, 303.85, 378.48, 479.21] },
            { linha: 'SARRAFO 6mm',           p: [245.84, 282.53, 319.22, 397.67, 503.60] },
            { linha: 'SÓLIDA',                p: [325.27, 360.05, 394.80, 469.43, 570.16] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'SARRAFO 6mm', p: [298.98, 344.98, 390.99, 487.51, 617.84] },
            { linha: 'SÓLIDA',     p: [389.93, 435.93, 481.94, 578.46, 708.79] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'SARRAFO 6mm', p: [314.72, 363.14, 411.57, 513.17, 650.36] },
            { linha: 'SÓLIDA',     p: [405.67, 454.09, 502.52, 604.12, 741.31] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'SARRAFO 6mm', p: [330.46, 381.30, 432.15, 538.83, 682.88] },
            { linha: 'SÓLIDA',     p: [421.41, 472.25, 523.10, 629.78, 773.83] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 87.08 },
      { item: 'Borracha',            p: 22.00 },
      { item: 'Frizos nas Portas',   p: 26.59 },
      { item: 'Furo Universal',      p: 26.00 },
      { item: 'Fechadura Soprano',   p: 42.00 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',          p:   5.68 },
      { item: 'Dob. Sobrepor',             p:   8.33 },
      { item: 'Dob. Pado Rolamento',       p:  11.11 },
      { item: 'Visor / Veneziana',         p: 135.00 },
      { item: 'Painel 1 Lado / Bandeira',  p: 118.00 },
    ]
  },
  distribuidora: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [229.44, 263.00, 296.56, 369.24, 467.37] },
            { linha: 'SARRAFO 6mm',           p: [241.90, 277.55, 313.21, 390.06, 493.80] },
            { linha: 'SÓLIDA',                p: [347.67, 381.23, 414.80, 487.48, 585.61] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [263.46, 301.99, 340.54, 424.00, 536.69] },
            { linha: 'SARRAFO 6mm',           p: [277.76, 318.72, 359.64, 447.90, 567.02] },
            { linha: 'SÓLIDA',                p: [381.69, 420.23, 458.77, 542.23, 654.93] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [275.31, 315.57, 355.09, 443.08, 560.83] },
            { linha: 'SARRAFO 6mm',           p: [290.25, 333.06, 375.83, 468.05, 592.54] },
            { linha: 'SÓLIDA',                p: [393.55, 433.81, 473.33, 561.31, 679.07] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [253.88, 291.53, 329.19, 410.02, 519.17] },
            { linha: 'SARRAFO 6mm',           p: [266.34, 306.08, 345.84, 430.82, 545.59] },
            { linha: 'SÓLIDA',                p: [372.11, 409.77, 447.42, 528.26, 637.40] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [291.51, 334.78, 378.00, 470.83, 596.15] },
            { linha: 'SARRAFO 6mm',           p: [305.83, 351.47, 397.12, 494.72, 626.50] },
            { linha: 'SÓLIDA',                p: [409.75, 453.01, 496.24, 589.07, 714.39] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [304.62, 349.83, 395.01, 492.02, 622.97] },
            { linha: 'SARRAFO 6mm',           p: [319.59, 367.29, 414.99, 516.97, 654.68] },
            { linha: 'SÓLIDA',                p: [422.85, 468.07, 513.24, 610.26, 741.21] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'SARRAFO 6mm', p: [388.68, 448.48, 508.29, 633.76, 803.19] },
            { linha: 'SÓLIDA',     p: [506.91, 566.71, 626.52, 752.00, 921.43] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'SARRAFO 6mm', p: [409.14, 472.08, 535.04, 667.12, 845.47] },
            { linha: 'SÓLIDA',     p: [527.37, 590.32, 653.28, 785.36, 963.70] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'SARRAFO 6mm', p: [429.59, 495.69, 561.79, 700.48, 887.74] },
            { linha: 'SÓLIDA',     p: [547.83, 613.92, 680.03, 818.71, 1005.98] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 113.20 },
      { item: 'Borracha',            p:  28.60 },
      { item: 'Frizos nas Portas',   p:  34.57 },
      { item: 'Furo Universal',      p:  33.80 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',          p:   7.38 },
      { item: 'Dob. Sobrepor',             p:  10.83 },
      { item: 'Dob. Pado Rolamento',       p:  14.44 },
      { item: 'Visor / Veneziana',         p: 175.50 },
      { item: 'Painel 1 Lado / Bandeira',  p: 153.40 },
    ]
  },
};
portasLaccaData.dag = portasLaccaData.distribuidora;

// ── PORTAS ELO DATA (canal ELO / Distribuidora, 6 larguras) ──────────────
const portasELOData = {
  colecoes: [
    {
      nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
      grupos: [
        { nome: 'ELO BRANCO', tipo: 'bianco', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [215.04, 215.04, 215.04, 261.37, 330.58, 380.18] },
          { linha: 'SARRAFO 6mm',           p: [229.02, 229.02, 229.02, 278.36, null,   null  ] },
        ]},
        { nome: 'ELO CURUPIXA', tipo: 'curupixa', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [221.49, 221.49, 221.49, 269.21, 340.50, 391.58] },
          { linha: 'SARRAFO 6mm',           p: [235.89, 235.89, 235.89, 286.71, null,   null  ] },
        ]},
      ]
    },
    {
      nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
      grupos: [
        { nome: 'ELO BRANCO', tipo: 'bianco', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [240.85, 240.85, 240.85, 292.73, null, null] },
          { linha: 'SARRAFO 6mm',           p: [256.50, 256.50, 256.50, 311.76, null, null] },
        ]},
        { nome: 'ELO CURUPIXA', tipo: 'curupixa', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [252.89, 252.89, 252.89, 307.37, null, null] },
          { linha: 'SARRAFO 6mm',           p: [269.33, 269.33, 269.33, 327.35, null, null] },
        ]},
      ]
    },
  ],
  adicionais: [
    { item: 'Montagem / Usinagem', p:  84.00 },
    { item: 'Borracha',            p:  10.47 },
    { item: 'Frizos nas Portas',   p:  29.32 },
    { item: 'Furo Universal',      p:  28.67 },
    { item: 'Fechadura Soprano',   p:  44.10 },
  ],
  ferragens: [
    { item: 'Dobradiça Comum',         p:   5.96 },
    { item: 'Dob. Sobrepor',            p:   6.30 },
    { item: 'Dob. Pado Rolamento',      p:  11.67 },
    { item: 'Visor / Veneziana',        p: 148.84 },
    { item: 'Painel 1 Lado / Bandeira', p: 130.10 },
  ],
};

// ── BATENTE ELO DATA (canal ELO / Distribuidora) ─────────────────────────
const eloAcabBase = {
  batente: {
    title: 'Batente ELO', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm',   itens: [
        { acab: 'ELO BRANCO',    preco: 101.94, protect: 123.49 },
        { acab: 'ELO CURUPIXÁ', preco: 104.99, protect: 126.55 },
      ]},
      { label: '6,5 cm',   itens: [
        { acab: 'ELO BRANCO',    preco: 114.17, protect: 135.73 },
        { acab: 'ELO CURUPIXÁ', preco: 117.59, protect: 139.15 },
      ]},
      { label: '7,5 cm',   itens: [
        { acab: 'ELO BRANCO',    preco: 127.87, protect: 149.43 },
        { acab: 'ELO CURUPIXÁ', preco: 131.71, protect: 153.26 },
      ]},
      { label: '8,5 cm',   itens: [
        { acab: 'ELO BRANCO',    preco: 143.21, protect: 183.79 },
        { acab: 'ELO CURUPIXÁ', preco: 147.51, protect: 188.08 },
      ]},
      { label: '10 cm',    itens: [
        { acab: 'ELO BRANCO',    preco: 160.40, protect: 200.97 },
        { acab: 'ELO CURUPIXÁ', preco: 165.21, protect: 205.78 },
      ]},
      { label: '12 cm',    itens: [
        { acab: 'ELO BRANCO',    preco: 179.65, protect: 232.90 },
        { acab: 'ELO CURUPIXÁ', preco: 185.04, protect: 238.29 },
      ]},
      { label: '14/15 cm', itens: [
        { acab: 'ELO BRANCO',    preco: 224.56, protect: 277.82 },
        { acab: 'ELO CURUPIXÁ', preco: 231.30, protect: 284.55 },
      ]},
      { label: '18 cm',    itens: [
        { acab: 'ELO BRANCO',    preco: 251.51, protect: 317.44 },
        { acab: 'ELO CURUPIXÁ', preco: 259.05, protect: 324.98 },
      ]},
      { label: '21 cm',    itens: [
        { acab: 'ELO BRANCO',    preco: 281.69, protect: 347.62 },
        { acab: 'ELO CURUPIXÁ', preco: 290.14, protect: 356.07 },
      ]},
    ]
  }
};

// ── BAT. / ALIZAR / RODAPÉ LACCA DATA (base Fábrica — mult aplicado no render) ──
const laccaAcabBase = {
  batente: {
    title: 'Batente LACCA', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  98.94, protect: 115.94 },
        { acab: 'LACCA PET BLANCO',                      preco: 103.38, protect: 120.38 },
      ]},
      { label: '6,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 109.70, protect: 126.70 },
        { acab: 'LACCA PET BLANCO',                      preco: 114.63, protect: 131.63 },
      ]},
      { label: '7,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 120.39, protect: 137.39 },
        { acab: 'LACCA PET BLANCO',                      preco: 125.80, protect: 142.80 },
      ]},
      { label: '8,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 135.11, protect: 167.11 },
        { acab: 'LACCA PET BLANCO',                      preco: 141.18, protect: 173.18 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 149.84, protect: 181.84 },
        { acab: 'LACCA PET BLANCO',                      preco: 156.57, protect: 188.57 },
      ]},
      { label: '12 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 178.00, protect: 220.00 },
        { acab: 'LACCA PET BLANCO',                      preco: 186.01, protect: 228.01 },
      ]},
      { label: '14 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 224.05, protect: 266.05 },
        { acab: 'LACCA PET BLANCO',                      preco: 234.13, protect: 276.13 },
      ]},
      { label: '18 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 273.15, protect: 325.15 },
        { acab: 'LACCA PET BLANCO',                      preco: 285.44, protect: 337.44 },
      ]},
      { label: '21 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 345.90, protect: 397.90 },
        { acab: 'LACCA PET BLANCO',                      preco: 361.46, protect: 413.46 },
      ]},
    ]
  },
  alizar9: {
    title: 'Alizar LACCA — 9mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5×5',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 113.24, protect: 131.24 },
        { acab: 'LACCA PET BLANCO',                      preco: 118.32, protect: 136.32 },
      ]},
      { label: '5×7',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 120.85, protect: 138.85 },
        { acab: 'LACCA PET BLANCO',                      preco: 126.29, protect: 144.29 },
      ]},
      { label: '5×10',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 134.88, protect: 152.88 },
        { acab: 'LACCA PET BLANCO',                      preco: 140.95, protect: 158.95 },
      ]},
      { label: '7×5',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 136.88, protect: 154.88 },
        { acab: 'LACCA PET BLANCO',                      preco: 143.04, protect: 161.04 },
      ]},
      { label: '7×7',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 143.41, protect: 161.41 },
        { acab: 'LACCA PET BLANCO',                      preco: 149.86, protect: 167.86 },
      ]},
      { label: '7×10',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 157.75, protect: 175.75 },
        { acab: 'LACCA PET BLANCO',                      preco: 164.85, protect: 182.85 },
      ]},
      { label: '10×5',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 173.32, protect: 191.32 },
        { acab: 'LACCA PET BLANCO',                      preco: 181.11, protect: 199.11 },
      ]},
      { label: '3cm Pinado',   itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  65.27, protect:  83.27 },
        { acab: 'LACCA PET BLANCO',                      preco:  92.02, protect: 110.02 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  92.02, protect: 110.02 },
        { acab: 'LACCA PET BLANCO',                      preco:  92.02, protect: 110.02 },
      ]},
      { label: '10×10',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 236.58, protect: 254.58 },
        { acab: 'LACCA PET BLANCO',                      preco: 247.22, protect: 265.22 },
      ]},
    ]
  },
  alizar15: {
    title: 'Alizar LACCA — 15mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5×5',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 151.46, protect: 169.46 },
        { acab: 'LACCA PET BLANCO',                      preco: 158.27, protect: 176.27 },
      ]},
      { label: '5×7',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 157.57, protect: 175.57 },
        { acab: 'LACCA PET BLANCO',                      preco: 164.66, protect: 182.66 },
      ]},
      { label: '5×10',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 171.86, protect: 189.86 },
        { acab: 'LACCA PET BLANCO',                      preco: 179.59, protect: 197.59 },
      ]},
      { label: '7×5',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 167.17, protect: 185.17 },
        { acab: 'LACCA PET BLANCO',                      preco: 174.69, protect: 192.69 },
      ]},
      { label: '7×10',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 189.82, protect: 207.82 },
        { acab: 'LACCA PET BLANCO',                      preco: 198.36, protect: 216.36 },
      ]},
      { label: '10×5',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 210.22, protect: 228.22 },
        { acab: 'LACCA PET BLANCO',                      preco: 219.67, protect: 237.67 },
      ]},
      { label: '10×10',      itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 286.95, protect: 304.95 },
        { acab: 'LACCA PET BLANCO',                      preco: 299.85, protect: 317.85 },
      ]},
      { label: '3cm Pinado', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 100.28, protect: 118.28 },
      ]},
      { label: '7 Plus',     itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 218.29, protect: 236.29 },
        { acab: 'LACCA PET BLANCO',                      preco: 228.11, protect: 246.11 },
      ]},
    ]
  },
  rodape: {
    title: 'Rodapé LACCA', subtitle: '15mm × 2,40m MDF Superflora',
    grupos: [
      { label: '5 cm',  itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 26.89, precoMl: 11.20 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 28.10, precoMl: 11.71 },
      ]},
      { label: '7 cm',  itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 33.34, precoMl: 13.89 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 34.83, precoMl: 14.51 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 47.23, precoMl: 19.68 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 49.35, precoMl: 20.56 },
      ]},
      { label: '15 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 56.13, precoMl: 23.39 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 58.65, precoMl: 24.44 },
      ]},
      { label: '20 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 85.99, precoMl: 35.83 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 89.86, precoMl: 37.44 },
      ]},
    ]
  },
  kitCorrer: {
    title: 'Kit Porta de Correr LACCA',
    itens: [
      { item: 'Suporte Correr + Vista (5×3 — 2,40m) Semi Montado — Melamínico todos padrões', preco: 334.16 },
      { item: 'Trilho, Roldana e Guia',                                                         preco: 127.92 },
    ]
  },
};

// ── BAT. / ALIZAR / RODAPÉ MELAMÍNICO DATA (base Fábrica — mult aplicado no render) ──
const melamAcabBase = {
  batente: {
    title: 'Batente Melamínico', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco:  88.22, protect: 105.22 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco:  94.64, protect: 111.64 },
      ]},
      { label: '6,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco:  97.82, protect: 114.82 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 104.86, protect: 121.86 },
      ]},
      { label: '7,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 107.34, protect: 124.34 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 115.06, protect: 132.06 },
      ]},
      { label: '8,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 120.48, protect: 152.48 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 130.45, protect: 162.45 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 133.61, protect: 165.61 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 145.84, protect: 177.84 },
      ]},
      { label: '12 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 158.72, protect: 200.72 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 169.74, protect: 211.74 },
      ]},
      { label: '14 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 199.78, protect: 241.78 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 213.53, protect: 255.53 },
      ]},
      { label: '18 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 243.56, protect: 295.56 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 259.82, protect: 311.82 },
      ]},
      { label: '21 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 308.44, protect: 360.44 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 329.34, protect: 381.34 },
      ]},
    ]
  },
  alizar9: {
    title: 'Alizar Melamínico — 9mm', subtitle: 'MDF Superflora',
    grupos: [
      { label: '5×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 100.98, protect: 118.98 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 107.74, protect: 125.74 },
      ]},
      { label: '5×7', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 107.76, protect: 125.76 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 116.38, protect: 134.38 },
      ]},
      { label: '5×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 120.28, protect: 138.28 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 131.26, protect: 149.26 },
      ]},
      { label: '7×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 122.05, protect: 140.05 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 133.21, protect: 151.21 },
      ]},
      { label: '7×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 140.40, protect: 158.40 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 157.80, protect: 175.80 },
      ]},
      { label: '10×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 154.54, protect: 172.54 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 169.37, protect: 187.37 },
      ]},
      { label: '10×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 210.94, protect: 228.94 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 231.19, protect: 249.19 },
      ]},
      { label: '3cm Pinado', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 62.42, protect: 80.42 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 88.84, protect: 106.84 },
      ]},
      { label: '7 Plus', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 161.46, protect: 179.46 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 181.47, protect: 199.47 },
      ]},
    ]
  },
  alizar15: {
    title: 'Alizar Melamínico — 15mm', subtitle: 'MDF Superflora',
    grupos: [
      { label: '5×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 135.06, protect: 153.06 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 148.16, protect: 166.16 },
      ]},
      { label: '5×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 153.25, protect: 171.25 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 167.92, protect: 185.92 },
      ]},
      { label: '7×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 149.06, protect: 167.06 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 161.57, protect: 179.57 },
      ]},
      { label: '7×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 169.27, protect: 187.27 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 185.20, protect: 203.20 },
      ]},
      { label: '10×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO', preco: 187.45, protect: 205.45 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 104.83, protect: 122.83 },
      ]},
      { label: '7 Plus', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 194.66, protect: 212.66 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 212.98, protect: 230.98 },
      ]},
    ]
  },
  rodape: {
    title: 'Rodapé Melamínico', subtitle: '15mm × 2,40m MDF Superflora',
    grupos: [
      { label: '5 cm',  itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 23.98, precoMl:  9.99 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 27.12, precoMl: 11.30 },
      ]},
      { label: '7 cm',  itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 29.74, precoMl: 12.39 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 32.04, precoMl: 13.35 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 42.12, precoMl: 17.55 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 45.63, precoMl: 19.01 },
      ]},
      { label: '15 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 50.04, precoMl: 20.85 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 54.15, precoMl: 22.56 },
      ]},
      { label: '20 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 76.68, precoMl: 31.95 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 83.43, precoMl: 34.76 },
      ]},
    ]
  },
  kitCorrer: {
    title: 'Kit Porta de Correr Melamínico',
    itens: [
      { item: 'Melamínico — todos os padrões', preco: 276.81 },
      { item: 'Trilho, Roldana e Guia',        preco: 127.92 },
    ]
  },
};

// ── PORTAS UV / MELAMÍNICO DATA ───────────────────────────────
const portasUVData = {
  fabrica: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [166.18, 189.86, 213.53, 264.62, 334.73] },
            { linha: 'SARRAFO 6mm',           p: [176.85, 202.29, 227.77, 283.46, 358.65] },
            { linha: 'SÓLIDA',                p: [257.13, 280.81, 304.48, 355.57, 425.68] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [180.71, 207.14, 233.58, 290.83, 368.12] },
            { linha: 'SARRAFO 6mm',           p: [190.52, 218.61, 246.69, 307.23, 388.93] },
            { linha: 'SÓLIDA',                p: [271.66, 298.09, 324.53, 381.78, 459.07] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [199.81, 229.26, 258.69, 322.16, 407.84] },
            { linha: 'SARRAFO 6mm',           p: [210.12, 241.29, 272.46, 339.36, 429.69] },
            { linha: 'SÓLIDA',                p: [290.76, 320.21, 349.64, 413.11, 498.79] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [187.08, 214.25, 241.42, 300.53, 380.35] },
            { linha: 'SARRAFO 6mm',           p: [197.74, 226.70, 255.64, 318.33, 402.93] },
            { linha: 'SÓLIDA',                p: [278.03, 305.20, 332.37, 391.48, 471.30] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [199.96, 229.62, 259.28, 322.95, 408.91] },
            { linha: 'SARRAFO 6mm',           p: [209.77, 241.08, 272.39, 339.33, 429.72] },
            { linha: 'SÓLIDA',                p: [290.91, 320.57, 350.23, 413.90, 499.86] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [220.03, 252.85, 285.67, 355.89, 450.68] },
            { linha: 'SARRAFO 6mm',           p: [230.33, 264.88, 299.45, 373.09, 472.54] },
            { linha: 'SÓLIDA',                p: [310.98, 343.80, 376.62, 446.84, 541.63] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [280.63, 323.81, 366.99, 457.60, 579.92] },
            { linha: 'SÓLIDA',     p: [371.58, 414.76, 457.94, 548.55, 670.87] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [294.66, 340.00, 385.34, 480.48, 608.91] },
            { linha: 'SÓLIDA',     p: [390.16, 435.50, 480.84, 575.98, 704.41] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p:  87.08 },
      { item: 'Borracha',            p:  22.00 },
      { item: 'Frizos nas Portas',   p:  26.59 },
      { item: 'Furo Universal',      p:  26.00 },
      { item: 'Fechadura Soprano',   p:  42.00 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   5.68 },
      { item: 'Dob. Sobrepor',            p:   8.33 },
      { item: 'Dob. Pado Rolamento',      p:  11.11 },
      { item: 'Visor / Veneziana',        p: 135.00 },
      { item: 'Painel 1 Lado / Bandeira', p: 118.00 },
    ]
  },
  distribuidora: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [226.84, 259.16, 291.47, 361.21, 456.91] },
            { linha: 'SARRAFO 6mm',           p: [241.40, 276.13, 310.91, 386.92, 489.56] },
            { linha: 'SÓLIDA',                p: [350.98, 383.31, 415.62, 485.35, 581.05] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [246.67, 282.75, 318.84, 396.98, 502.48] },
            { linha: 'SARRAFO 6mm',           p: [260.06, 298.40, 336.73, 419.37, 530.89] },
            { linha: 'SÓLIDA',                p: [370.82, 406.89, 442.98, 521.13, 626.63] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [272.74, 312.94, 353.11, 439.75, 556.70] },
            { linha: 'SARRAFO 6mm',           p: [286.81, 329.36, 371.91, 463.23, 586.53] },
            { linha: 'SÓLIDA',                p: [396.89, 437.09, 477.26, 563.90, 680.85] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [255.36, 292.45, 329.54, 410.22, 519.18] },
            { linha: 'SARRAFO 6mm',           p: [269.92, 309.45, 348.95, 434.52, 550.00] },
            { linha: 'SÓLIDA',                p: [379.51, 416.60, 453.69, 534.37, 643.32] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [272.95, 313.43, 353.92, 440.83, 558.16] },
            { linha: 'SARRAFO 6mm',           p: [286.34, 329.07, 371.81, 463.19, 586.57] },
            { linha: 'SÓLIDA',                p: [397.09, 437.58, 478.06, 564.97, 682.31] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [300.34, 345.14, 389.94, 485.79, 615.18] },
            { linha: 'SARRAFO 6mm',           p: [314.40, 361.56, 408.75, 509.27, 645.02] },
            { linha: 'SÓLIDA',                p: [424.49, 469.29, 514.09, 609.94, 739.32] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [383.06, 442.00, 500.94, 624.62, 791.59] },
            { linha: 'SÓLIDA',     p: [507.21, 566.15, 625.09, 748.77, 915.74] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [402.21, 464.10, 525.99, 655.86, 831.16] },
            { linha: 'SÓLIDA',     p: [532.57, 594.45, 656.34, 786.21, 961.52] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 118.86 },
      { item: 'Borracha',            p:  30.03 },
      { item: 'Frizos nas Portas',   p:  36.30 },
      { item: 'Furo Universal',      p:  35.49 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   7.38 },
      { item: 'Dob. Sobrepor',            p:  10.83 },
      { item: 'Dob. Pado Rolamento',      p:  14.44 },
      { item: 'Visor / Veneziana',        p: 184.28 },
      { item: 'Painel 1 Lado / Bandeira', p: 161.07 },
    ]
  },
  dag: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [216.03, 246.82, 277.59, 344.01, 435.15] },
            { linha: 'SARRAFO 6mm',           p: [229.91, 262.98, 296.10, 368.50, 466.25] },
            { linha: 'SÓLIDA',                p: [334.27, 365.05, 395.82, 462.24, 553.38] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [234.92, 269.28, 303.65, 378.08, 478.56] },
            { linha: 'SARRAFO 6mm',           p: [247.68, 284.19, 320.70, 399.40, 505.61] },
            { linha: 'SÓLIDA',                p: [353.16, 387.52, 421.89, 496.31, 596.79] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [259.75, 298.04, 336.30, 418.81, 530.19] },
            { linha: 'SARRAFO 6mm',           p: [273.16, 313.68, 354.20, 441.17, 558.60] },
            { linha: 'SÓLIDA',                p: [377.99, 416.27, 454.53, 537.04, 648.43] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [243.20, 278.53, 313.85, 390.69, 494.46] },
            { linha: 'SARRAFO 6mm',           p: [257.06, 294.71, 332.33, 413.83, 523.81] },
            { linha: 'SÓLIDA',                p: [361.44, 396.76, 432.08, 508.92, 612.69] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [259.95, 298.51, 337.06, 419.83, 531.58] },
            { linha: 'SARRAFO 6mm',           p: [272.70, 313.40, 354.11, 441.13, 558.64] },
            { linha: 'SÓLIDA',                p: [378.18, 416.74, 455.30, 538.07, 649.82] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [286.04, 328.70, 371.37, 462.66, 585.88] },
            { linha: 'SARRAFO 6mm',           p: [299.43, 344.34, 389.29, 485.02, 614.30] },
            { linha: 'SÓLIDA',                p: [404.27, 446.94, 489.61, 580.89, 704.12] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [364.82, 420.95, 477.09, 594.88, 753.90] },
            { linha: 'SÓLIDA',     p: [483.05, 539.19, 595.32, 713.12, 872.13] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [383.06, 442.00, 500.94, 624.62, 791.58] },
            { linha: 'SÓLIDA',     p: [507.21, 566.15, 625.09, 748.77, 915.74] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 113.20 },
      { item: 'Borracha',            p:  28.60 },
      { item: 'Frizos nas Portas',   p:  34.57 },
      { item: 'Furo Universal',      p:  33.80 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   7.38 },
      { item: 'Dob. Sobrepor',            p:  10.83 },
      { item: 'Dob. Pado Rolamento',      p:  14.44 },
      { item: 'Visor / Veneziana',        p: 175.50 },
      { item: 'Painel 1 Lado / Bandeira', p: 153.40 },
    ]
  },
};

const DATA = {
  portasLacca: { type: 'portasLacca' },
  portasUV: { type: 'portasUV' },
  portasELO: { type: 'portasELO' },
  laccaAcab: { type: 'laccaAcab' },
  melamAcab: { type: 'melamAcab' },
  batenteELO: { type: 'batenteELO' },
};

// ── STATE ────────────────────────────────────────────
let currentSection = 'portasLacca';
let currentChannel = 'fabrica';
const subTabState = {};
let searchTerm = '';
