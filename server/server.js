const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const cors = require("cors");

const app = express();

const PORT = 8080;

/* Creating a new schema for the User model. */
const CoursesSchema = new mongoose.Schema({
  name: String,
  surname: String,
  desc: String,
  position: String,
  src: String,
});



const CoursesModel = mongoose.model("Courses", CoursesSchema);

mongoose.set("strictQuery", false);
mongoose
  .connect(`mongodb+srv://af201:KlSC1UDnr1vp9XGa@cluster.oyql5cj.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));




const addCoursesSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  desc: Joi.string().required(),
  position: Joi.string().required(),
  src: Joi.string().required(),
});

app.use(express.json());
app.use(cors())





/* Creating a new product and saving it to the database. */
app.post(
  "/api/courses",
  (req, res, next) => {
    const { error } = addCoursesSchema.validate(req.body);

    if (error == null) next();
    else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(422).json({ error: message });
    }
  },
  async (req, res) => {
    const newCourses = new CoursesModel({ ...req.body });

    await newCourses.save();
    res
      .status(201)
      .send({ message: "Product succesfully added!", product: newCourses });
  }
);

/* Getting all the products from the database and sending them to the client. */
app.get("/api/courses", (req, res) => {
  CoursesModel.find(null, "name surname desc position src", (error, products) => {
    if (error) return res.status(500).send({ error });
    res.send(products);
  });
});

/* Deleting the product with the id that is passed in the url. */
app.delete("/api/courses/:id", (req, res) => {
  if (req.params.id)
    CoursesModel.findByIdAndDelete(req.params.id, (error, data) => {
      if (error) return res.status(500).send({ error });

      res.send(data);
    });
});



/* Listening to the port 8080 and if it is running it will print "Server running on 8080" */
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});

//KlSC1UDnr1vp9XGa