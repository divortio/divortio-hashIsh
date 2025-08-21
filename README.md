# hashIsh.js Landing Page & Cloudflare Worker

This repository contains the source code for the `hashIsh.js` landing page, a lightweight, single-page application
designed to demonstrate the functionality of the `hashIsh.js` library. The project is structured as a Cloudflare Worker
for easy, serverless deployment.

## About hashIsh.js

`hashIsh.js` is a lightweight, deterministic, non-cryptographic hashing library. It is designed to be fast and to
produce a stable, predictable hash for any given JavaScript value. "Stable" means that the same input will always
produce the same output. For objects, the keys are sorted before serialization to ensure that `{a: 1, b: 2}`
and `{b: 2, a: 1}` produce the same hash.

This is particularly useful for creating idempotent identifiers, simple checksums, or any scenario where a consistent,
unique signature for a piece of data is required.

---

## Features

* **Deterministic:** The same input will always produce the exact same output.
* **Lightweight:** The library is a single, dependency-free file, making it easy to integrate into any project.
* **Stable Object Hashing:** Object keys are sorted before hashing, ensuring that objects with the same keys and values
  produce the same hash, regardless of key order.
* **Customizable Length:** The desired length of the output hash can be specified.
* **Non-Cryptographic:** Designed for speed and predictability, not for security-sensitive applications like password
  hashing.

---

## Usage

To use `hashIsh.js`, simply include the `hashIsh.js` file in your project and call the global `hashIsh` function.
The `length` and `PUSH_CHARS` parameters are optional.

```javascript
// Example with an Object, using default length (12)
const myObject = { name: "John", age: 30 };
const objectHash = hashIsh(myObject);
console.log(objectHash);

// Example with a String and custom length
const myString = "hello world";
const stringHash = hashIsh(myString, 16);
console.log(stringHash);

// Example with a custom character set
const myCustomChars = 'abcdef123456';
const customHash = hashIsh("some data", 20, myCustomChars);
console.log(customHash);
```


## Deployment to Cloudflare

This project is designed to be deployed as a Cloudflare Worker. The following steps assume you have a Cloudflare account
and have cloned this repository to your own GitHub account.

### 1. Create a New Cloudflare Project

1. Log in to your Cloudflare dashboard.
2. Navigate to **Workers & Pages**.
3. Click **Create application**, then select the **Pages** tab.
4. Click **Connect to Git**.

### 2. Connect to Your GitHub Repository

1. Select the GitHub repository you created for this project.
2. Click **Begin setup**.

### 3. Configure the Build Settings

Cloudflare will automatically detect that this is a static project and will not require any build commands.

* **Project name:** Choose a name for your project (e.g., `hashish-landing-page`).
* **Production branch:** Select your main branch (e.g., `main` or `master`).
* **Build command:** Leave this blank.
* **Build output directory:** Set this to `/public`.

### 4. Deploy

1. Click **Save and Deploy**.
2. Cloudflare will now build and deploy your project. Once complete, you can access it via the provided `.pages.dev`
   subdomain.

### 5. Add a Custom Domain (Optional)

1. In your project's dashboard, navigate to the **Custom domains** tab.
2. Follow the instructions to add your custom domain (e.g., `hashish.tools.divort.io`) and verify ownership.

---

## License

This project is licensed under the MIT License.
