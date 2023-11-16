# WiseTodo - Web App de _To Do_ com Autenticação, Armazenamento via Firebase e Dicas com IA

Este repositório contém o código-fonte de um Web App de _To Do_ (lista de tarefas) que oferece recursos de autenticação de usuários, armazenamento das tarefas utilizando o Firebase e sugestões/dicas para as tarefas obtidas através de API de Inteligência Artificial.  
O projeto foi feito como trabalho prático para a disciplina de Web Services, onde o objetivo era construir uma aplicação web _mobile first_, utilizando duas ou mais APIs.

## Recursos

- **Autenticação de Usuários**: Os usuários podem fazer _login_ via rede social ou entrar anonimamente.
- **Criação de Tarefas**: O Web App permite que os usuários criem novas tarefas e caso o usuário não tenha idéia de uma tarefa, a IA pode sugerir uma.
- **Armazenamento de Tarefas**: As tarefas criadas pelos usuários são armazenadas de forma segura no Firebase, permitindo que sejam acessadas e gerenciadas de qualquer dispositivo.
- **Geração de Dicas e Dificuldade para Tarefa**: O Web App utiliza uma IA para gerar dicas relacionadas às tarefas cadastradas pelos usuários e também para indicar para o usuário a dificuldade de executar a tarefa no tempo limite cadastrado. Essas dicas são fornecidas com base em modelos de linguagem avançados e podem ajudar os usuários a obter _insights_ e ideias para suas tarefas.
- **Interface Amigável**: O Web App possui uma interface intuitiva e amigável, proporcionando uma experiência agradável ao usuário.
- **Escolha de Temas**: O Web App possui temas _dark_ e _light_ para atender as preferências do usuário.

## Tecnologias Utilizadas

- **Vue.js**: O _framework_ Vue.js é utilizado para construir a interface do usuário de forma reativa e modularizada através de componentes.
- **Typescript**: O Typescript é utilizado para tipar as classes e interfaces do Web App.
- **Tailwind CSS**: O Tailwind CSS é utilizado para estilizar a interface do usuário e promover responsividade.
- **Firebase**: O Firebase é usado para autenticação de usuários e armazenamento seguro das tarefas.
- **LM Studio Server**: O LM Studio opera como uma API, replicando as funcionalidades da OpenAI, porém, rodando um modelo LLM localmente. Dessa forma, pode fornecer dicas e sugestões para as tarefas cadastradas pelos usuários.

## Requisitos

- **[Node.js](https://nodejs.org/en)**
- **[Chave de autenticação Firebase](https://firebase.google.com/docs/projects/api-keys?hl=pt-br)**
- **[Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart?hl=pt-br)**
- **[LM Studio](https://lmstudio.ai/)**
- **[Modelo LLM](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending)**

## Como Rodar

Após certificar-se de que os requisitos foram cumpridos, siga os passos a seguir:

- Clone o repositório: `git clone https://github.com/VitorST1/WiseTodo.git` ou baixe o .zip: `wget https://github.com/VitorST1/WiseTodo/archive/refs/heads/master.zip` e descompacte-o.
- Entre na pasta do projeto.
- Configure suas chaves no arquivo `.env-example` e renomee-o para `.env`. Depois, execute na pasta do projeto os seguintes comandos:
- `npm install`: Irá instalar as dependências. Rode apenas na primeira vez que for executar a aplicação.
- `npm run dev`: Irá rodar o servidor de desenvolvimento, disponibilizando o endereço onde está rodando a aplicação (geralmente <http://localhost:5173>) OU  
`npm run dev -- --host`: Irá rodar o servidor de desenvolvimento, mas disponibilizando a aplicação para outros dispositivos na rede local, através do IP da máquina.

Acesse o endereço do servidor para acessar a aplicação.

## Demonstração

Uma demonstração do web app pode ser encontrada no site de apresentação: [GitHub Pages](https://vitorst1.github.io/WiseTodo-Presentation/)
