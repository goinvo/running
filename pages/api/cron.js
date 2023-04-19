import { standardizePageId } from "../../utils/format";
import { getFileList } from "../../utils/data";

export default async function handler(req, res) {
  const [fileList, client] = await getFileList(true);
  const urls = fileList.map((item) => {
    return `https://running.goinvo.com/${standardizePageId(item.name)}`;
  })
  urls.push('https://running.goinvo.com');
  urls.push('https://running.goinvo.com/index');

  for (let i = 0; i < 4; i++) {
    setTimeout(async () => {
      for (const url of urls) {
        console.log('visiting ' + url);
        await fetch(url);
      }
    }, i * 3000);
  }

  res.status(200).end('Good!');
}