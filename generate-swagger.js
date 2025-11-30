import postmanToOpenApi from "postman-to-openapi";

const postmanFile = "./postman/SE4458-midterm-lara.postman_collection.json";
const outputFile = "./openapi.yaml";

postmanToOpenApi(postmanFile, outputFile, { defaultTag: "BillingAPI" })
  .then(() => console.log(" OpenAPI YAML generated!"))
  .catch(err => console.error(" Conversion failed:", err));
