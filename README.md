<h1 align="center">Aplicativo de Localização de Postos de Combustível</h1>

<h2>Descrição:</h2>

Este é um protótipo de um aplicativo web (programado em um desafio de 54h) que visa auxiliar o usuário na busca por postos de combustíveis na sua proximidade que estejam dentro da tolerância documentada. O aplicativo utiliza web scraping para catalogar os dados do Inmetro no último ano para identificar os postos que atendem aos critérios de qualidade do combustível.

<h2>Funcionalidades:</h2>

Localização de postos próximos ao usuário;
Apresentação da tolerância documentada para cada tipo de combustível;
Exibição da distância do posto até o usuário;
Opção para atualizar o banco de dados com os dados mais recentes do Inmetro.
Como executar:

Clone o repositório do aplicativo;
Instale as dependências necessárias: <pre>npm install</pre>
Execute o aplicativo: <pre>node index.js</pre>
Atualização do Banco de Dados:

Para atualizar o banco de dados com os dados mais recentes do Inmetro, execute o seguinte comando:

<pre>node receive_data.js</pre>

<h2>Observações:</h2>

Este é um protótipo.
