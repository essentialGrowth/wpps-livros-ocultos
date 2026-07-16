# Guia rápido: como adicionar / remover número de WhatsApp com segurança

Este é o **passo a passo que você segue toda vez** que precisar mexer nos números
do randomizador. Ele existe para nunca mais mandar lead para número desativado.

Documento técnico completo: [RANDOMIZADOR-WHATSAPP.md](RANDOMIZADOR-WHATSAPP.md).

> **Regra de ouro:** desativar o número antigo no WhatsApp é sempre o **último**
> passo — só depois de confirmar, com seus próprios olhos, que a versão nova já
> está no ar.

---

## Onde ficam as coisas

- **Lista de números:** no arquivo `wa-config.js`, dentro do repositório do GitHub
  `essentialGrowth/wpps-livros-ocultos`. É esse arquivo que todos os domínios leem.
- **URL de produção** (a que os leads usam):
  `https://cdn.jsdelivr.net/gh/essentialGrowth/wpps-livros-ocultos@main/wa-config.js`
- Editar aqui vale para **todos os domínios de uma vez**. Você não precisa mexer
  em nenhum `index.html`.

---

## O que é o WA_CONFIG_VERSION (o "carimbo de versão")

No topo do `wa-config.js` existe esta linha:

```js
window.WA_CONFIG_VERSION = '2026-07-16-01';
```

Pense nela como a **data de validade impressa na embalagem**. É um carimbo que
identifica *qual* versão do arquivo está no ar. Ele não muda o funcionamento dos
números — serve só para **você conseguir confirmar** se a atualização já chegou.

**Por que isso importa:** duas versões do arquivo (a antiga e a nova) podem ter
listas de números parecidas e te enganar. O carimbo elimina a dúvida — se o
carimbo que aparece no ar é o novo, a versão nova chegou; se é o antigo, não
chegou ainda.

### "Bumpar" o WA_CONFIG_VERSION

"Bumpar" = **trocar esse valor por um novo, maior**, toda vez que você editar a
lista de números. É o que prova que houve mudança.

- Formato usado: `ANO-MÊS-DIA-NN` (`NN` = a edição do dia: 01, 02, 03...).
- Exemplos de bump:
  - Primeira edição de hoje: `'2026-07-16-01'`
  - Segunda edição no mesmo dia: `'2026-07-16-02'`
  - Uma edição amanhã: `'2026-07-17-01'`
- Regra única: **sempre mudar e sempre para um valor "maior"/novo**. Nunca repetir
  um carimbo já usado.

---

## O fluxo completo, passo a passo

### Passo 1 — Editar a lista no GitHub

1. Abra o `wa-config.js` no repositório `essentialGrowth/wpps-livros-ocultos`.
2. Na lista `window.WA_NUMEROS`, **adicione** ou **remova** o número:
   ```js
   window.WA_NUMEROS = [
     '557588484131',
     '5575988484131'
     // adicione novos aqui, um por linha, entre aspas e com vírgula
   ];
   ```
3. **Bumpe o carimbo** logo acima (obrigatório):
   ```js
   window.WA_CONFIG_VERSION = '2026-07-16-02'; // <- valor novo
   ```
4. **Commit** da mudança.

> ⚠️ Se você está **removendo** um número e ele também é o que está escrito
> "fixo" dentro do `index.html` (o número de segurança/fallback), troque o
> `index.html` para um número ativo antes. Em dúvida, me chame.

### Passo 2 — Purgar (forçar a atualização na CDN)

Só commitar **não** basta: a CDN (jsDelivr) guarda uma cópia em cache e pode
continuar servindo a versão antiga por um tempo. O **purge** força ela a pegar a
versão nova imediatamente.

Como purgar:

1. Acesse: **https://www.jsdelivr.com/tools/purge**
2. Cole a URL do arquivo (uma por linha; inclua o utm se também tiver mexido):
   ```
   https://cdn.jsdelivr.net/gh/essentialGrowth/wpps-livros-ocultos@main/wa-config.js
   ```
3. Clique em **Purge**.

Alternativa rápida (mesmo efeito): abra esta URL direto no navegador —
```
https://purge.jsdelivr.net/gh/essentialGrowth/wpps-livros-ocultos@main/wa-config.js
```

### Passo 3 — Conferir se a versão nova apareceu

Este é o passo que te protege. Você vai **olhar com seus próprios olhos** o que
está no ar.

1. Abra no navegador a **URL de produção**:
   ```
   https://cdn.jsdelivr.net/gh/essentialGrowth/wpps-livros-ocultos@main/wa-config.js
   ```
2. Force o navegador a ignorar o cache dele: aperte **Ctrl + F5**
   (ou abra numa aba anônima).
3. Olhe o topo do arquivo e confirme **as duas coisas**:
   - O `WA_CONFIG_VERSION` é o **carimbo novo** que você acabou de pôr.
   - A `WA_NUMEROS` é a **lista nova** (com o número adicionado / sem o removido).

**Resultado:**
- ✅ Carimbo novo + lista nova → deu certo, pode ir ao Passo 4.
- ❌ Ainda aparece o carimbo antigo → o purge não pegou ainda. Espere ~1 minuto,
  repita o Passo 2 (purge) e o Passo 3. **Não avance** enquanto não ver o novo.

### Passo 3b (opcional, recomendado) — Conferir na página real

Além do arquivo, dá para conferir direto numa presell:

1. Abra a landing page numa **aba anônima** e aperte **Ctrl + F5**.
2. Aperte **F12** para abrir o DevTools → aba **Console**.
3. Cole e rode:
   ```js
   console.log('versao:', window.WA_CONFIG_VERSION, 'numeros:', window.WA_NUMEROS);
   [...document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]')]
     .forEach(a => console.log(a.href));
   ```
4. Confirme que a versão é a nova, a lista é a nova, e que **todos** os links
   apontam para um número que está na lista (nenhum aponta para número removido).

### Passo 4 — Só agora, desativar o número antigo

Confirmou que a versão nova está no ar (Passo 3)? Só então você pode
**desativar / desligar** o número antigo no WhatsApp com segurança. A partir
desse momento nenhum lead novo será enviado para ele.

---

## Checklist para colar/rápido

**Adicionar número:**
- [ ] Adicionei o número em `WA_NUMEROS` no GitHub
- [ ] Bumpei o `WA_CONFIG_VERSION`
- [ ] Commitei
- [ ] Purguei no jsDelivr
- [ ] Conferi (Ctrl+F5) que a versão e a lista novas apareceram

**Remover número:**
- [ ] Removi o número de `WA_NUMEROS` no GitHub
- [ ] (Se era o fallback do `index.html`) troquei o `index.html` por um número ativo
- [ ] Bumpei o `WA_CONFIG_VERSION`
- [ ] Commitei
- [ ] Purguei no jsDelivr
- [ ] Conferi (Ctrl+F5) que a versão nova está no ar e a lista NÃO tem mais o número
- [ ] **Só então** desativei o número no WhatsApp

---

## Glossário

- **Bumpar:** aumentar/atualizar o número da versão (o `WA_CONFIG_VERSION`).
- **Purgar:** forçar a CDN a jogar fora a cópia antiga e pegar a versão nova.
- **Cache:** cópia guardada temporariamente. É o que faz a versão antiga
  "insistir" em aparecer até você purgar.
- **CDN (jsDelivr):** servidor que distribui o `wa-config.js` para todos os
  domínios de forma rápida.
- **Fallback:** o número escrito "fixo" no `index.html`, usado caso o script não
  carregue. Precisa ser sempre um número ativo.
