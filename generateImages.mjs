import fs from "fs";
import sharp from "sharp";

const avatarList = [];
const images = fs.readdirSync("./public/images/avatars");

const init = async () => {
  for (let i=0; i<images.length; i++) {
    sharp(`./public/images/avatars/${images[i]}`)
      .jpeg({ quality: 100 })
      .resize({ width: 50, height: 50, fit: "cover", position: "center" })
      .toFile(`./public/images/avatars-micro/${images[i].split(".")[0]}.jpg`);

    sharp(`./public/images/avatars/${images[i]}`)
      .jpeg({ quality: 100 })
      .resize({ width: 80, height: 80, fit: "cover", position: "center" })
      .toFile(`./public/images/avatars-mini/${images[i].split(".")[0]}.jpg`);
  
    const base64 = await sharp(`./public/images/avatars/${images[i]}`)
      .blur(10)
      .jpeg({ quality: 10 })
      .resize({ width: 80, height: 80, fit: "cover", position: "center" })
      .toBuffer()
    
    avatarList.push({name: images[i].split(".")[0], base64: base64.toString("base64")})
    console.log(`Image ${i+1} of ${images.length} processed`);
  }

  fs.writeFileSync("./src/data/avatarList.ts", 
`const avatarList: { [image: string]: string } = {\n${avatarList.map((avatar) => `  ${avatar.name}: "${avatar.base64}"`).join(",\n")}
};

export default avatarList;`);
}

init();