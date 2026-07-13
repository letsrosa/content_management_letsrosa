# Diário de Conteúdo

App local para organizar ideias de conteúdo para Instagram, com foco em dois pilares de nicho: **tecnologia para mulheres iniciantes** e **lifestyle** (alimentação saudável + vida ativa). Tem duas páginas: **Ideias** (fluxo de criação de conteúdo) e **Publicidade** (controle de campanhas patrocinadas/publis).

Fluxo central da página Ideias: **Ideia → Roteiro → Produção → Publicado**.

## Stack

- **Frontend:** React 18 + Vite + TypeScript, CSS Modules, React Router (navegação entre Ideias e Publicidade)
- **Backend:** Node.js + Express + TypeScript
- **Banco de dados:** SQLite via `node:sqlite` (módulo nativo do Node, arquivo local em `server/data/conteudo.db`)
- **Validação:** zod
- **Testes:** Vitest

> **Nota:** a especificação original previa `better-sqlite3`, mas essa dependência exige compilar um binário nativo via `node-gyp`. Nesta máquina não havia Visual Studio Build Tools instaladas nem binário pré-compilado disponível para a versão do Node em uso, então o projeto usa o módulo nativo `node:sqlite` (Node ≥ 22.5), que oferece a mesma API síncrona sem precisar de compilação.

## Pré-requisitos

- Node.js 22.5+ (o projeto foi construído e testado com Node 24)

## Instalação e uso

```bash
npm install
npm run dev
```

Isso sobe backend (`http://localhost:3333`) e frontend (`http://localhost:5173`) em paralelo. Abra `http://localhost:5173` no navegador.

Os dados ficam persistidos em `server/data/conteudo.db` — o arquivo é criado automaticamente na primeira execução e não é versionado no git. Para fazer backup, basta copiar esse arquivo.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe client e server em paralelo |
| `npm run lint` | Roda ESLint em `server` e `client` |
| `npm run test` | Roda os testes do backend (Vitest) |
| `npm run dev -w server` | Sobe só o backend |
| `npm run dev -w client` | Sobe só o frontend |

## Funcionalidades (MVP)

1. Criar ideia (título, pilar, formato, status, data prevista, notas)
2. Listar ideias em timeline, mais recentes primeiro
3. Filtrar por pilar (Tech / Lifestyle / Ambos) e por status
4. Editar ideia existente
5. Mudar status direto no card, sem abrir formulário
6. Excluir ideia
7. Estado vazio com call-to-action quando não há ideias no filtro atual

A mudança de status segue a ordem do fluxo (idea → script → production → published): é possível avançar um estágio por vez ou voltar livremente, mas não pular etapas.

## Funcionalidades (Publicidade)

1. Cadastrar campanha/publi (marca, nome da campanha, formato, valor, status da campanha, status do pagamento, datas, roteiro)
2. 5 cards de resumo no topo, sempre em sincronia com o banco:
   - **Total** — contagem de todas as campanhas
   - **Ativas** — negociando, confirmadas ou em andamento
   - **Total R$** — soma do valor de todas as campanhas
   - **Receber R$** — soma do valor das campanhas com status "Confirmada" (independente do pagamento já ter sido feito ou não)
   - **Recebido R$** — soma do valor das campanhas já pagas
3. Tabela de campanhas com mudança de status da campanha e do pagamento direto na linha (badge colorida por status: negociando cinza, confirmada e concluída verde, em andamento amarelo; pagamento pendente amarelo, pago verde)
4. Alerta visual automático de atraso (pagamento pendente + data de vencimento já passada)
5. Clicar na linha abre um modal com os detalhes completos e o Roteiro (falas, ganchos, observações do contrato)
6. Editar e excluir campanha (pelo modal de detalhes)
7. Estado vazio com call-to-action quando não há campanhas cadastradas
