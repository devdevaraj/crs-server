import docsModel from "../models/docs.model.js";

export async function getDocs(req, res) {
  try {
    const query = {};
    const filter = {};
    const dname = req.query.dname;
    if(req.query.list){
       filter._id = 1;
    } else if(req.query.doc == 1){
       filter.document = 1;
    } else if(req.query.doc == 0){
      filter.document = 0;
    } else if(req.query.image == 1) {
      filter.image = 1;
    }
    if(req.query.docId){
      if(req.query.docId === "undefined") return res.status(404).send({ error: "Id cannot be undefined"});
      query._id = req.query.docId;
    }
    let limit = req.query.limit;
    const auth = req.user;
    if (dname) query.dname = dname;
    if (!auth) query.privacy = "public";
    if(!limit) limit = 1000;
    docsModel
      .find(query,filter).limit(limit)
      .then((doc) => {
        if (!doc)
          return res.status(404).send({ error: "Couldn't find document" });
        return res.status(201).send(doc);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Couldn't find document" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Document not found" });
  }
}

export async function setDocs(req, res) {
  try {
    const { did, dname, title, image, date, privacy, document } = req.body;
    const documentExist = new Promise((resolve, reject) => {
      docsModel
        .findOne({ did: did })
        .then((doc) => {
          if (doc) reject({ error: "Document already in" });
          resolve();
        })
        .catch((error) => {
          reject(new Error(error));
        });
    });
    documentExist
      .then(() => {
        if (!document)
          return res.status(401).send({ error: "Document cannot be empty" });
        const doc = docsModel({
          did: did,
          dname: dname,
          title: title,
          image: image,
          date: date,
          privacy: privacy,
          document: document,
        });
        doc
          .save()
          .then(() => {
            return res
              .status(201)
              .send({ msg: "Document inserted successfully" });
          })
          .catch((error) => {
            console.log(error);
            return res.status(501).send({ error: "Unable to insert document" });
          });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send(error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Couldn't insert document" });
  }
}

export async function updateDocs(req, res) {
  try {
    const { docId, ...rest } = req.body;
    if (docId) {
      docsModel
        .updateOne({ _id: docId }, rest)
        .then(() => {
          return res.status(200).send({ msg: "Document updated successfully" });
        })
        .catch((error) => {
          console.log(error);
          return res.status(401).send({ error: "Unable to update document" });
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Couldn't update document" });
  }
}

export async function remove(req, res) {
  try {
    const { did } = req.query;
    docsModel.findOne({ did: did })
    .then(doc => {
      if (!doc) return res.status(404).send({ error: "The document does not exist" });
      docsModel
      .deleteOne({ _id: doc._id })
      .then(() => {
        return res.status(200).send({ msg: "Document removed successfully" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ error: "Internal server error" });
      });
    }).catch(error => {
      console.log(error);
      return res.status(500).send({ error: "Some error occured" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Couldn't remove document" });
  }
}
