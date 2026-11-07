# Rei da Dedetização — Landing page

Site estático responsivo feito com HTML, CSS e JavaScript puro. Não precisa instalar dependências nem executar uma etapa de build.

## Abrir no VS Code

1. Abra a pasta do projeto no VS Code (`Arquivo > Abrir Pasta...`).
2. Abra `index.html` e edite o conteúdo. Os estilos ficam em `styles.css` e o JavaScript em `script.js`.
3. Para visualizar, use a extensão Live Server ou inicie um servidor local no terminal, dentro desta pasta:

   ```powershell
   python -m http.server 8000
   ```

4. Acesse `http://localhost:8000` no navegador. Encerre o servidor com `Ctrl+C`.

Também é possível abrir `index.html` diretamente no navegador, mas o servidor local representa melhor os caminhos e o comportamento do site.

## Contato

Os CTAs de atendimento usam o link oficial do WhatsApp configurado em `index.html`:

`https://wa.me/message/2HGAC7V32YFZE1`

Não há formulário, integração de analytics ou telefone `tel:` configurado. Se o link oficial mudar, atualize todos os links de contato em `index.html`.

## Arquivos

- `index.html`: conteúdo da landing page, metadados, FAQ e links de contato.
- `styles.css`: identidade visual, estilos e pontos de quebra responsivos.
- `script.js`: pequenos aprimoramentos progressivos; a página funciona sem ele.
- `privacidade.html`: rascunho de política de privacidade, ainda pendente de revisão pela empresa.
- `assets/favicon-coroa.png`: favicon quadrado derivado de `imagem/Coroa Geométrica Verde Escura.png`.
- `assets/logo-coroa-rei.png`: recorte otimizado para uso como símbolo junto ao nome da marca.
- `imagem/logo png rei.png`: arquivo original da logo, preservado.

## Fotografias usadas no site

As quatro fotografias estão armazenadas localmente em `assets/`, otimizadas em JPEG e não dependem de links externos em tempo de execução. As imagens são do Pexels; sua licença permite uso em sites comerciais sem atribuição obrigatória. As páginas de origem ficam registradas abaixo para referência:

- `hero-atendimento.jpg`: [Profissional em fumigação interna](https://www.pexels.com/photo/person-wearing-personal-protective-equipment-fumigating-indoor-4176542/), Michelangelo Buonarroti.
- `controle-insetos.jpg`: [Controle de pragas em área externa](https://www.pexels.com/photo/smoke-used-for-pest-control-19789841/), Garda Pest Control Indonesia.
- `atendimento-residencial.jpg`: [Fumigação de planta em ambiente interno](https://www.pexels.com/photo/person-in-white-protective-clothing-fumigating-an-indoor-plant-4176548/), Michelangelo Buonarroti.
- `atendimento-comercial.jpg`: [Fumigação em galpão](https://www.pexels.com/photo/professional-fumigation-in-warehouse-setting-32055757/), Cristian Aragón.

## Antes de publicar

- Completar e validar a política de privacidade conforme os dados e processos reais da empresa.
- Confirmar nome empresarial, domínio público e regiões atendidas antes de adicionar dados estruturados locais, URL canônica, imagem Open Graph absoluta ou sitemap.
- Confirmar serviços, disponibilidade e informações comerciais com a empresa. O conteúdo atual não afirma atendimento em cidades específicas, preços, certificações, avaliações ou resultados garantidos.

O projeto não contém dados estruturados de empresa local porque endereço, área de atendimento e domínio ainda não foram fornecidos.
