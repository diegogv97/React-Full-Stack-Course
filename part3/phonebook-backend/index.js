require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
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
app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      return response.json(person);
    }

    return response.status(404).end();
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id).then((deletedUser) => {
    if (!deletedUser) {
      return response.status(404).end();
    }

    return response.status(204).end();
  });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  Person.findOne({ name })
    .then((foundPerson) => {
      if (foundPerson) {
        return Promise.reject("name must be unique");
      }

      const person = new Person({ name, number });
      return person.save();
    })
    .catch((error) => {
      response.status(400).json({ error });
    })
    .then((person) => {
      return response.json(person);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
