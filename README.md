# Visualize Fotografia

Portfólio estático da Visualize Studio, feito em HTML, CSS e JavaScript, sem dependências ou etapa de compilação.

## Estrutura

- `index.html`, `styles.css`, `script.js`: seleção dos seis álbuns.
- `assets/logo.svg`: marca do portfólio.
- `assets/covers/`: capas em WebP.
- `lucas/`: página, estilos, interações e 40 fotografias do álbum The Lucas.
- `paulo/`: página, estilos, interações e 20 fotografias do álbum Paulo.
- `lucas/assets/photo-map.json` e `paulo/assets/photo-map.json`: registros dos arquivos originais e das exportações; não são necessários para exibir as galerias.
- `local-server.js`: servidor para prévia local; excluído da publicação.
- `vercel.json`: configuração da hospedagem estática.

Lucas e Paulo estão disponíveis. Jessica, Tauane, Rafael e Luis Ricardo aparecem como indisponíveis.

## Prévia local

Com Node.js instalado, execute nesta pasta:

```sh
node local-server.js
```

Abra http://127.0.0.1:5500. Encerre o servidor com Ctrl+C.

Alternativamente, com Python instalado:

```sh
python -m http.server 8080
```

Abra http://localhost:8080.

## Publicar pelo GitHub e Vercel

1. Envie o conteúdo desta pasta para o repositório, preservando as subpastas e os nomes dos arquivos.
2. Confirme no GitHub que estão presentes `assets/covers/`, `lucas/assets/photos/` (40 JPGs) e `paulo/assets/photos/` (20 JPGs).
3. Importe o repositório na Vercel.
4. Em Root Directory, escolha a pasta que contém este `index.html` e `vercel.json`. Se o conteúdo estiver na raiz do repositório, mantenha a raiz.
5. Use o preset Other. O `vercel.json` define saída na própria pasta e nenhuma etapa de build. Não é necessário comando de instalação nem variável de ambiente.
6. Publique e confira a página inicial e os dois álbuns.

Mantenha as URLs `lucas/lucas.html` e `paulo/paulo.html`. A configuração preserva a extensão `.html`, usada pelos links e pelos caminhos relativos das imagens. Não adicione um redirecionamento global de todas as URLs para `index.html`.

## Tipografia e música

Georgia (regular, negrito, itálico e negrito itálico) e Impact são carregadas dos arquivos locais em `assets/georgia/` e `assets/Impact/`, declarados em `assets/fonts.css`. As duas galerias incluem esse CSS e antecipam o carregamento das fontes principais. Arial e Courier New continuam sendo fontes do dispositivo, com alternativas no CSS. Não há API externa de fontes.

As galerias usam a API do YouTube para a trilha e precisam de internet para a música. O código tenta iniciar a reprodução com som; o navegador pode bloquear o início automático. Nesse caso, use o botão de som. Fotografias e demais recursos visuais são locais.

## Conferência após publicar

- Navegue pelas seis capas e abra Lucas e Paulo.
- Confira as 40 fotos de Lucas e as 20 de Paulo, incluindo a visualização ampliada.
- Verifique o layout em computador e celular.
- Se uma imagem falhar, abra sua URL diretamente e confira se o arquivo está no GitHub, com o mesmo caminho e as mesmas maiúsculas/minúsculas.

A pasta `.vercel/`, credenciais e arquivos temporários são ignorados pelo Git. A publicação também exclui o servidor de desenvolvimento, este README e os mapas de origem das fotos.
