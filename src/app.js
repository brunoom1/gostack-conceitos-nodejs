const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Repository is not found' })
  }

  const findedRepository = repositories[indexRepository];
  const repositoryCopy = {
    ...findedRepository, 
    title, 
    url, 
    techs
  };

  repositories[indexRepository] = repositoryCopy;

  return response.status(200).json(repositoryCopy);    
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Repository is not found.' });
  }

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository < 0) {
    return response.status(400).json({ error: "Repository is not found."});
  }

  const repositoryCopy = { ...repositories[indexRepository] };
  repositoryCopy.likes += 1;

  repositories[indexRepository] = repositoryCopy;

  return response.status(201).json(repositoryCopy);
});

module.exports = app;
