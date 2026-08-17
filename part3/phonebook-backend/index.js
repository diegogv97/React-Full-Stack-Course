require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  }),
);

app.get("/info", (request, response) => {
  Person.find({}).then((people) => {
    const info = `<h2>Phonebook has info for ${people.length} people</h2>`;
    const currentdate = `<p>${new Date()}</p>`;
    response.send(info + currentdate);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        return response.json(person);
      }

      return response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return response.status(404).end();
      }

      return response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save({ runValidators: true }).then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  Person.findOne({ name })
    .then((foundPerson) => {
      if (foundPerson) {
        return Promise.reject({ name: "DuplicatedName" });
      }

      const person = new Person({ name, number });
      return person.save({ runValidators: true }).then((person) => {
        return response.json(person);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === "DuplicatedName") {
    return response.status(400).send({ error: "name must be unique" });
  }

  next(error);
};
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
