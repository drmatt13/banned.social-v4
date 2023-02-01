import fs from "fs";
import sharp from "sharp";

const avatarList = [];
const images = fs.readdirSync("./public/images/avatars");



// const init = async () => {
//   for (let i=0; i<images.length; i++) {

//     const base64 = await sharp(`./public/images/avatars/${images[i]}`)
//       .jpeg({ quality: 100 })
//       .resize({ width: 80, height: 80, fit: "cover", position: "center" })
//       .toBuffer()
    
//     avatarList.push({name: images[i].split(".")[0], base64: base64.toString("base64")})
//     console.log(`Image ${i+1} of ${images.length} processed`);
//   }

//   fs.writeFileSync("./src/data/avatarList.ts", 
// `const avatarList: { [image: string]: string } = {\n${avatarList.map((avatar) => `  ${avatar.name}: "${avatar.base64}"`).join(",\n")}
// };

// export default avatarList;`);
// }

// init();


console.log(sharp.apply("./public/images/avatars/african_usa.png"))