import { checkSchema, validationResult } from "express-validator";

const schema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category validation failed , type must be  string ",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "content validation failed , type must be string ",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "author.name validation failed , type must be string",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage: "author.avatar validation failed , type must be string",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumeric: {
      errorMessage: "readTime.value  validation failed , type must be numeric ",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "readTime.unit  validation failed , type must be string ",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "cover validation failed , type must be string",
    },
  },
};

const searchSchema = {
  title: {
    in: ["query"],
    isString: {
      errorMessage:
        "title must be in query and type must be  string to search!",
    },
  },
};

const commentSchema = {
  text: {
    isString: {
      errorMessage: "Text field is required for comment",
    },
  },
  userName: {
    isString: {
      errorMessage: "User name is required for comment",
    },
  },
};

const netflixSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  year: {
    in: ["body"],
    isString: {
      errorMessage: "category validation failed , type must be  string ",
    },
  },
  type: {
    in: ["body"],
    isString: {
      errorMessage: "content validation failed , type must be string ",
    },
  },
  poster: {
    in: ["body"],
    isString: {
      errorMessage: "author.name validation failed , type must be string",
    },
  },
};

export const checkCommentSchema = checkSchema(commentSchema);

export const checkSearchSchema = checkSchema(searchSchema);

export const checkBlogPostSchema = checkSchema(schema);

export const checkMediaSchema = checkSchema(netflixSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};
