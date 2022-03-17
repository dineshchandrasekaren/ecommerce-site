const { mongoose } = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DATABASE GOT CONNECTED"))
    .catch((err) => console.log(err));
};
