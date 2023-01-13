import express from "express";

import fs from "fs";

import uniqid from "uniqid";

import path, { dirname } from "path";

import { fileURLToPath } from "url";
import { parseFile } from "../utils/upload/index.js";

import {
  checkBlogPostSchema,
  checkCommentSchema,
  checkSearchSchema,
  checkMediaSchema,
  checkValidationResult,
} from "./validation.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const mediasFilePath = path.join(__dirname, "netflix.json");

const router = express.Router();

// get all medias
router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.get(
  "/search",
  checkSearchSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { title } = req.query;
      const fileAsBuffer = fs.readFileSync(mediasFilePath);
      const fileAsString = fileAsBuffer.toString();
      const array = JSON.parse(fileAsString);
      const filtered = array.filter((media) =>
        media.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(filtered);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

// create  media
router.post(
  "/",
  checkMediaSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const media = {
        id: uniqid(),
        ...req.body,
      };

      const fileAsBuffer = fs.readFileSync(mediasFilePath);

      const fileAsString = fileAsBuffer.toString();

      const fileAsJSONArray = JSON.parse(fileAsString);

      fileAsJSONArray.push(media);

      fs.writeFileSync(mediasFilePath, JSON.stringify(fileAsJSONArray));

      res.send(media);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

// get single media
router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const media = fileAsJSONArray.find((media) => media.id === req.params.id);
    if (!media) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }
    res.send(media);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const media = fileAsJSONArray.find((media) => media.id === req.params.id);
    if (!media) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }

    media.comments = media.comments || [];
    res.send(media.comments);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  media
router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const media = fileAsJSONArray.find((media) => media.id === req.params.id);
    if (!media) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (media) => media.id !== req.params.id
    );
    fs.writeFileSync(mediasFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update media
router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const mediaIndex = fileAsJSONArray.findIndex(
      (media) => media.id === req.params.id
    );
    if (!mediaIndex == -1) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }
    const previousMediaData = fileAsJSONArray[mediaIndex];
    const changedMedia = {
      ...previousMediaData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[mediaIndex] = changedmedia;

    fs.writeFileSync(mediasFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedMedia);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.put(
  "/:id/comment",
  checkCommentSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { text, userName } = req.body;
      const comment = { id: uniqid(), text, userName, createdAt: new Date() };
      const fileAsBuffer = fs.readFileSync(mediasFilePath);

      const fileAsString = fileAsBuffer.toString();

      let fileAsJSONArray = JSON.parse(fileAsString);

      const mediaIndex = fileAsJSONArray.findIndex(
        (media) => media.id === req.params.id
      );
      if (!mediaIndex == -1) {
        res
          .status(404)
          .send({ message: `media with ${req.params.id} is not found!` });
      }
      const previousMediaData = fileAsJSONArray[mediaIndex];
      previousMediaData.comments = previousMediaData.comments || [];
      const changedMedia = {
        ...previousMediaData,
        ...req.body,
        comments: [...previousmediaData.comments, comment],
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[mediaIndex] = changedMedia;

      fs.writeFileSync(mediasFilePath, JSON.stringify(fileAsJSONArray));
      res.send(changedMedia);
    } catch (error) {
      console.log(error);
      res.send(500).send({ message: error.message });
    }
  }
);

router.put("/:id/cover", parseFile.single("cover"), async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(mediasFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const mediaIndex = fileAsJSONArray.findIndex(
      (media) => media.id === req.params.id
    );
    if (!mediaIndex == -1) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }
    const previousMediaData = fileAsJSONArray[mediaIndex];
    const changedMedia = {
      ...previousMediaData,
      cover: req.file.path,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[mediaIndex] = changedMedia;

    fs.writeFileSync(mediasFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedMedia);
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});

export default router;
