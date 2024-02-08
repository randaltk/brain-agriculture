# Documentação da API - Brain Agriculture

Bem-vindo à documentação da API Brain Agriculture, que fornece informações sobre produtores agrícolas e dados relacionados. Esta API permite a realização de operações como obter informações sobre produtores, modificar dados de produtores, visualizar estatísticas agrícolas, entre outros.

URL PROD: https://brain-agriculture.onrender.com/producers


- Clone o Repositório:
Use o Git para clonar o repositório localmente.

- Acesse o Diretório:
Navegue até o diretório da aplicação.

- Instale as Dependências:
Execute npm install para instalar as dependências.

- Inicie a Aplicação:
Use npm start:dev para iniciar o servidor local em http://localhost:3000.

# Recursos Disponíveis
A seguir estão os recursos disponíveis na API.

1. Informações do Produtor

1.1 - Obter Todos os Produtores

Endpoint: /producers

Método: GET

Descrição: Retorna informações sobre todos os produtores cadastrados.

curl -X GET /producers

1.2 - Obter Informações de um Produtor Específico

Endpoint: /producers/{id}

Método: GET

Descrição: Retorna informações detalhadas sobre um produtor específico com base no ID.

curl -X GET /producers/3

1.3 - Adicionar um Novo Produtor

Endpoint: /producers

Método: POST

Descrição: Adiciona um novo produtor com base nos dados fornecidos no corpo da solicitação.

curl -X POST -H "Content-Type: application/json" -d '{"cpfCnpj": "53053113000111", "name": "Geronimo", "farmName": "Farm", "city": "MG", "state": "MG", "totalArea": 2290, "cultivableArea": 170, "vegetationArea": 20, "cultures": [{"name": "Soybean", "area": 300}, {"name": "Corn", "area": 200}]}' /producers

1.4 - Editar Informações de um Produtor

Endpoint: /producers/{id}

Método: PUT

Descrição: Atualiza as informações de um produtor com base no ID fornecido.
curl -X PUT -H "Content-Type: application/json" -d '{"id": 3, "cpfCnpj": "24936797000100", "name": "Randassfaaal", "farmName": "Farm", "city": "SP", "state": "SP", "totalArea": 23003, "cultivableArea": 2500, "vegetationArea": 3200}' /producers/3

1.5 - Excluir um Produtor

Endpoint: /producers/{id}

Método: DELETE

Descrição: Remove um produtor com base no ID fornecido.

curl -X DELETE /producers/2

2. Estatísticas Agrícolas

2.1 - Estatísticas Gerais

Endpoint: /producers/dashboard/total-farms

Método: GET

Descrição: Retorna estatísticas gerais sobre todas as fazendas cadastradas.

curl -X GET /producers/dashboard/total-farms

2.2 - Estatísticas de Culturas por Estado

Endpoint: /producers/dashboard/state-pie-chart

Método: GET

Descrição: Retorna estatísticas de culturas agrícolas divididas por estado.

curl -X GET /producers/dashboard/state-pie-chart

2.3 - Estatísticas de Culturas por Tipo

Endpoint: /producers/dashboard/culture-pie-chart

Método: GET

Descrição: Retorna estatísticas de culturas agrícolas divididas por tipo.

curl -X GET /producers/dashboard/culture-pie-chart

2.4 - Estatísticas de Uso da Terra

Endpoint: /producers/dashboard/land-use-pie-chart

Método: GET

Descrição: Retorna estatísticas sobre o uso da terra nas fazendas cadastradas.

curl -X GET /producers/dashboard/land-use-pie-chart

3. Informações Geográficas

3.1 - Produtores por Cidade

Endpoint: /producers/cities/{city}

Método: GET

Descrição: Retorna informações sobre os produtores localizados em uma cidade 
específica.

curl -X GET /producers/cities/MG

3.2 - Produtores por Estado

Endpoint: /producers/states

Método: GET

Descrição: Retorna informações sobre os produtores agrupados por estado.

curl -X GET /producers/states