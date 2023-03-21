# Projeto Labeddit Back-End
## link do front-end do projeto https://github.com/italodve/labeddit-front-end

# Tecnologias
- NodeJS
- Typescript
- Express
- SQL e SQLite
- Knex
- POO
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman

# Banco de dados

https://dbdiagram.io/d/640b1843296d97641d86f727

- Endpoints
    - [ ]  signup
    - [ ]  login
    - [ ]  get posts
    - [ ]  create post
    - [ ]  edit post
    - [ ]  delete post
    - [ ]  like / dislike post
    - [ ]  Add reply
    - [ ]   get replys
    - [ ]  create reply
    - [ ]  edit reply
    - [ ]  delete reply
    - [ ]  like / dislike reply

- Autenticação e autorização
    - [ ]  identificação UUID
    - [ ]  senhas hasheadas com Bcrypt
    - [ ]  tokens JWT
 
 - Código
    - [ ]  POO
    - [ ]  Arquitetura em camadas
    - [ ]  Roteadores no Express

# Exemplos de requisição

## Signup
Endpoint público utilizado para cadastro. Devolve um token jwt.
```typescript
// request POST /users/signup
// body JSON
{
  "name": "Beltrana",
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 201 CREATED
{
  token: "um token jwt"
}
```

## Login
Endpoint público utilizado para login. Devolve um token jwt.
```typescript
// request POST /users/login
// body JSON
{
  "email": "beltrana@email.com",
  "password": "beltrana00"
}

// response
// status 200 OK
{
  token: "um token jwt"
}
```

## Get posts
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request GET /posts
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "uma uuid v4",
        "content": "Hoje vou estudar POO!",
        "likes": 2,
        "dislikes" 1,
        "createdAt": "2023-01-20T12:11:47:000Z"
        "updatedAt": "2023-01-20T12:11:47:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Fulano"
        }
    },
    {
        "id": "uma uuid v4",
        "content": "kkkkkkkkkrying",
        "likes": 0,
        "dislikes" 0,
        "createdAt": "2023-01-20T15:41:12:000Z"
        "updatedAt": "2023-01-20T15:49:55:000Z"
        "creator": {
            "id": "uma uuid v4",
            "name": "Ciclana"
        }
    }
]
```

## Create post
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request POST /posts
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour!"
}

// response
// status 201 CREATED
```

## Edit post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.
```typescript
// request PUT /posts/:id
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Partiu happy hour lá no point de sempre!"
}

// response
// status 200 OK
```

## Delete post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

```typescript
// request DELETE /posts/:id
// headers.authorization = "token jwt"

// response
// status 200 OK
```

## Like or dislike post (mesmo endpoint faz as duas coisas)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou o post não pode dar like ou dislike no mesmo.<br><br>
Caso dê um like em um post que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.
### Like (funcionalidade 1)
```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

### Dislike (funcionalidade 2)
```typescript
// request PUT /posts/:id/like
// headers.authorization = "token jwt"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```
###  Add reply
```typescript
// request PUT /posts/:id/reply
// headers.authorization = "token jwt"
// body JSON 
endpoint usado junto com create reply para somar e atulizar a quantidade de replys de um post
{
    "reply": boolen
}

// response
// status 200
```

## Create reply
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request POST /replys
// headers.authorization = "token jwt"
// body JSON
{
    "content": "Respondido"
}

// response
// status 201 CREATED
```

## Get replys By Post_Id
Endpoint protegido, requer um token jwt para acessá-lo.
```typescript
// request GET /replys/:id
// headers.authorization = "token jwt"

// response
// status 200 OK
[
    {
        "id": "ebf82bcf-1381-4759-867a-7e59c9c2d2a0",
        "post_id": "p001",
        "content": "vamos",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-03-20T17:47:57.375Z",
        "updatedAt": "2023-03-20T17:47:57.375Z",
        "creator": {
            "id": "263fc4d3-2b69-4af0-9f6f-b3acdfbafbb3",
            "name": "mariano"
        }
    },
    {
        "id": "e066fbb7-e8d9-4787-a849-7c832c4c8f63",
        "post_id": "p001",
        "content": "teste",
        "likes": 0,
        "dislikes": 1,
        "createdAt": "2023-03-20T17:57:11.940Z",
        "updatedAt": "2023-03-20T17:57:11.940Z",
        "creator": {
            "id": "263fc4d3-2b69-4af0-9f6f-b3acdfbafbb3",
            "name": "mariano"
        }
    },
    {
        "id": "b6658719-ff0e-4436-8b76-feb346c0637f",
        "post_id": "p001",
        "content": "teste",
        "likes": 0,
        "dislikes": 0,
        "createdAt": "2023-03-20T18:25:10.473Z",
        "updatedAt": "2023-03-20T18:25:10.473Z",
        "creator": {
            "id": "263fc4d3-2b69-4af0-9f6f-b3acdfbafbb3",
            "name": "mariano"
        }
   
]
```

